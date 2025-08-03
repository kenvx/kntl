export interface TestResult {
  url: string;
  statusCode?: number;
  statusText?: string;
  responseTime: number;
  dnsLookupTime?: number;
  tlsHandshakeTime?: number;
  error?: string;
  success: boolean;
  timestamp: Date;
}

export interface PingResult extends TestResult {
  dnsLookupTime: number;
  tlsHandshakeTime?: number;
}

export interface BenchmarkResult {
  url: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  fastestResponseTime: number;
  slowestResponseTime: number;
  requestsPerSecond: number;
  results: TestResult[];
}

export interface TestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: string | object;
  headers?: Record<string, string>;
  timeout?: number;
  json?: boolean;
  benchmark?: number;
}

export interface NetworkTesterConfig {
  timeout: number;
  userAgent: string;
  maxRedirects: number;
}
