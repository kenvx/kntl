import { NetworkTester } from './networkTester';
import { TestResult, BenchmarkResult } from '../types';

export class Benchmark {
  private networkTester: NetworkTester;

  constructor() {
    this.networkTester = new NetworkTester();
  }

  /**
   * Run benchmark test on a URL
   */
  async run(
    url: string, 
    count: number, 
    options: { 
      method?: string; 
      data?: any; 
      headers?: Record<string, string>;
      concurrency?: number;
    } = {}
  ): Promise<BenchmarkResult> {
    const { concurrency = 1 } = options;
    const results: TestResult[] = [];
    const startTime = Date.now();

    // Run tests in batches based on concurrency
    for (let i = 0; i < count; i += concurrency) {
      const batch = [];
      const batchSize = Math.min(concurrency, count - i);
      
      for (let j = 0; j < batchSize; j++) {
        batch.push(this.networkTester.test(url, options));
      }
      
      const batchResults = await Promise.all(batch);
      results.push(...batchResults);
    }

    const endTime = Date.now();
    const totalTime = (endTime - startTime) / 1000; // Convert to seconds

    // Calculate statistics
    const successfulRequests = results.filter(r => r.success).length;
    const failedRequests = results.length - successfulRequests;
    const responseTimes = results.map(r => r.responseTime);
    
    const averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const fastestResponseTime = Math.min(...responseTimes);
    const slowestResponseTime = Math.max(...responseTimes);
    const requestsPerSecond = results.length / totalTime;

    return {
      url,
      totalRequests: count,
      successfulRequests,
      failedRequests,
      averageResponseTime,
      fastestResponseTime,
      slowestResponseTime,
      requestsPerSecond,
      results
    };
  }

  /**
   * Run benchmark test on multiple URLs
   */
  async runMultiple(
    urls: string[], 
    count: number, 
    options: { 
      method?: string; 
      data?: any; 
      headers?: Record<string, string>;
    } = {}
  ): Promise<BenchmarkResult[]> {
    const benchmarkPromises = urls.map(url => this.run(url, count, options));
    return Promise.all(benchmarkPromises);
  }
}
