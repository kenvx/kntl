/**
 * @fileoverview NetworkTester - Core network testing functionality
 * Provides methods for testing HTTP endpoints, measuring performance, and ping operations
 * 
 * @author kenvx
 * @version 1.0.0
 */

import axios, { AxiosResponse } from 'axios';
import { performance } from 'perf_hooks';
import * as dns from 'dns';
import * as https from 'https';
import { URL } from 'url';
import { TestResult, PingResult, NetworkTesterConfig } from '../types';

/**
 * Core network testing class that provides HTTP testing and ping functionality
 */
export class NetworkTester {
  private config: NetworkTesterConfig;

  /**
   * Creates a new NetworkTester instance
   * @param config - Optional configuration overrides
   */
  constructor(config?: Partial<NetworkTesterConfig>) {
    this.config = {
      timeout: 10000,
      userAgent: 'KNTL/1.0.0 (Key Network Testing Library)',
      maxRedirects: 5,
      ...config
    };
  }

  /**
   * Ping a URL and measure response time, DNS lookup, and TLS handshake
   */
  async ping(url: string): Promise<PingResult> {
    const startTime = performance.now();
    const timestamp = new Date();

    try {
      const parsedUrl = new URL(url);
      
      // Measure DNS lookup time
      const dnsStartTime = performance.now();
      await this.dnsLookup(parsedUrl.hostname);
      const dnsLookupTime = performance.now() - dnsStartTime;

      // Measure TLS handshake time (for HTTPS)
      let tlsHandshakeTime: number | undefined;
      if (parsedUrl.protocol === 'https:') {
        const tlsStartTime = performance.now();
        await this.measureTlsHandshake(parsedUrl.hostname, parseInt(parsedUrl.port) || 443);
        tlsHandshakeTime = performance.now() - tlsStartTime;
      }

      // Make HTTP request
      const response = await axios.get(url, {
        timeout: this.config.timeout,
        maxRedirects: this.config.maxRedirects,
        headers: {
          'User-Agent': this.config.userAgent
        },
        validateStatus: () => true // Accept all status codes
      });

      const responseTime = performance.now() - startTime;

      return {
        url,
        statusCode: response.status,
        statusText: response.statusText,
        responseTime,
        dnsLookupTime,
        tlsHandshakeTime,
        success: response.status >= 200 && response.status < 400,
        timestamp
      };
    } catch (error) {
      const responseTime = performance.now() - startTime;
      return {
        url,
        responseTime,
        dnsLookupTime: 0,
        error: this.getErrorMessage(error),
        success: false,
        timestamp
      };
    }
  }

  /**
   * Test an API endpoint with custom options
   */
  async test(url: string, options: { 
    method?: string; 
    data?: any; 
    headers?: Record<string, string>;
  } = {}): Promise<TestResult> {
    const startTime = performance.now();
    const timestamp = new Date();

    try {
      const requestConfig = {
        method: options.method || 'GET',
        url,
        timeout: this.config.timeout,
        maxRedirects: this.config.maxRedirects,
        headers: {
          'User-Agent': this.config.userAgent,
          ...options.headers
        },
        data: options.data,
        validateStatus: () => true
      };

      const response: AxiosResponse = await axios(requestConfig);
      const responseTime = performance.now() - startTime;

      return {
        url,
        statusCode: response.status,
        statusText: response.statusText,
        responseTime,
        success: response.status >= 200 && response.status < 400,
        timestamp
      };
    } catch (error) {
      const responseTime = performance.now() - startTime;
      return {
        url,
        responseTime,
        error: this.getErrorMessage(error),
        success: false,
        timestamp
      };
    }
  }

  /**
   * Perform DNS lookup
   */
  private dnsLookup(hostname: string): Promise<string> {
    return new Promise((resolve, reject) => {
      dns.lookup(hostname, (err: Error | null, address: string) => {
        if (err) reject(err);
        else resolve(address);
      });
    });
  }

  /**
   * Measure TLS handshake time
   */
  private measureTlsHandshake(hostname: string, port: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const options = {
        host: hostname,
        port,
        rejectUnauthorized: false
      };

      const request = https.request(options, () => {
        request.destroy(); // Properly close the connection
        resolve();
      });

      request.on('error', (err: Error) => {
        request.destroy(); // Ensure cleanup on error
        reject(err);
      });

      request.setTimeout(this.config.timeout, () => {
        request.destroy();
        reject(new Error('TLS handshake timeout'));
      });

      request.end();
    });
  }

  /**
   * Extract error message from various error types
   */
  private getErrorMessage(error: any): string {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ENOTFOUND') {
        return 'DNS resolution failed';
      }
      if (error.code === 'ECONNREFUSED') {
        return 'Connection refused';
      }
      if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
        return 'Request timeout';
      }
      return error.message || 'Network error';
    }
    
    if (error instanceof Error) {
      return error.message;
    }
    
    return 'Unknown error';
  }
}
