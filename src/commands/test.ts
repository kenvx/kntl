import { Command } from 'commander';
import ora from 'ora';
import { NetworkTester } from '../core/networkTester';
import { Benchmark } from '../core/benchmark';
import { 
  validateUrl, 
  normalizeUrl, 
  formatTestResult,
  createResultsTable,
  formatBenchmarkResult,
  parseJsonData,
  parseHeaders,
  showError,
  showSuccess
} from './utils';

export function createTestCommand(): Command {
  const command = new Command('test');
  
  command
    .description('Test API endpoints with custom options')
    .argument('<urls...>', 'URLs to test (can be multiple)')
    .option('-m, --method <method>', 'HTTP method (GET, POST, PUT, DELETE, PATCH)', 'GET')
    .option('-d, --data <data>', 'JSON payload for POST/PUT requests')
    .option('-H, --header <header>', 'Custom headers (can be used multiple times)', (value: string, previous: string[]) => {
      return previous.concat([value]);
    }, [] as string[])
    .option('-j, --json', 'Output results in JSON format')
    .option('-t, --timeout <ms>', 'Request timeout in milliseconds', '10000')
    .option('-b, --benchmark <count>', 'Run benchmark with specified number of requests')
    .option('-c, --concurrency <num>', 'Number of concurrent requests for benchmark', '1')
    .action(async (urls: string[], options: {
      method?: string;
      data?: string;
      header?: string[];
      json?: boolean;
      timeout?: string;
      benchmark?: string;
      concurrency?: string;
    }) => {
      try {
        // Validate and normalize URLs
        const normalizedUrls = urls.map(url => {
          const normalized = normalizeUrl(url);
          if (!validateUrl(normalized)) {
            throw new Error(`Invalid URL: ${url}`);
          }
          return normalized;
        });

        // Parse options
        const method = options.method?.toUpperCase() as any;
        const timeout = parseInt(options.timeout || '10000');
        const benchmarkCount = options.benchmark ? parseInt(options.benchmark) : undefined;
        const concurrency = parseInt(options.concurrency || '1');

        // Validate method
        const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
        if (!validMethods.includes(method)) {
          throw new Error(`Invalid method: ${method}. Valid methods: ${validMethods.join(', ')}`);
        }

        // Parse data
        let parsedData: any;
        if (options.data) {
          if (method === 'GET') {
            showError('Cannot use --data with GET method');
            process.exit(1);
          }
          parsedData = parseJsonData(options.data);
        }

        // Parse headers
        const headers = options.header ? parseHeaders(options.header) : {};

        const testOptions = {
          method,
          data: parsedData,
          headers,
          timeout
        };

        if (benchmarkCount) {
          // Run benchmark tests
          await runBenchmarkTests(normalizedUrls, benchmarkCount, testOptions, concurrency, options.json);
        } else {
          // Run regular tests
          await runRegularTests(normalizedUrls, testOptions, options.json);
        }

      } catch (error) {
        showError(error instanceof Error ? error.message : 'An unexpected error occurred');
        process.exit(1);
      }
    });

  return command;
}

async function runRegularTests(
  urls: string[], 
  testOptions: any, 
  jsonOutput?: boolean
): Promise<void> {
  const networkTester = new NetworkTester({ timeout: testOptions.timeout });
  const results = [];

  for (const url of urls) {
    const spinner = ora(`Testing ${url}...`).start();
    
    try {
      const result = await networkTester.test(url, testOptions);
      results.push(result);
      
      if (!jsonOutput) {
        spinner.stop();
        console.log(formatTestResult(result));
      } else {
        spinner.stop();
      }
    } catch (error) {
      spinner.stop();
      if (!jsonOutput) {
        showError(`Failed to test ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  if (jsonOutput) {
    console.log(JSON.stringify(results, null, 2));
  } else if (urls.length > 1) {
    console.log(createResultsTable(results));
  }

  // Exit with error if any test failed
  const hasFailures = results.some(r => !r.success);
  if (hasFailures) {
    process.exit(1);
  }
}

async function runBenchmarkTests(
  urls: string[], 
  count: number, 
  testOptions: any, 
  concurrency: number,
  jsonOutput?: boolean
): Promise<void> {
  const benchmark = new Benchmark();
  const results = [];

  for (const url of urls) {
    const spinner = ora(`Running benchmark for ${url} (${count} requests)...`).start();
    
    try {
      const result = await benchmark.run(url, count, { ...testOptions, concurrency });
      results.push(result);
      
      spinner.stop();
      
      if (!jsonOutput) {
        console.log(formatBenchmarkResult(result));
      }
    } catch (error) {
      spinner.stop();
      if (!jsonOutput) {
        showError(`Benchmark failed for ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  if (jsonOutput) {
    console.log(JSON.stringify(results, null, 2));
  }

  // Show summary for multiple URLs
  if (urls.length > 1 && !jsonOutput) {
    const totalRequests = results.reduce((sum, r) => sum + r.totalRequests, 0);
    const totalSuccessful = results.reduce((sum, r) => sum + r.successfulRequests, 0);
    const avgResponseTime = results.reduce((sum, r) => sum + r.averageResponseTime, 0) / results.length;
    
    console.log('\n' + '='.repeat(50));
    console.log(`Total URLs tested: ${urls.length}`);
    console.log(`Total requests: ${totalRequests}`);
    console.log(`Overall success rate: ${((totalSuccessful / totalRequests) * 100).toFixed(1)}%`);
    console.log(`Average response time: ${avgResponseTime.toFixed(2)}ms`);
    
    showSuccess('Benchmark completed');
  }
}
