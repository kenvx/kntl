# API Documentation

## Overview

KNTL (Key Network Testing Library) provides a simple yet powerful API for testing HTTP endpoints and measuring network performance.

## Core Classes

### NetworkTester

The main class for performing network tests.

#### Constructor

```typescript
new NetworkTester(config?: Partial<NetworkTesterConfig>)
```

**Parameters:**
- `config` (optional): Configuration object to override defaults

**Default Configuration:**
```typescript
{
  timeout: 10000,              // Request timeout in milliseconds
  userAgent: 'KNTL/1.0.0',    // User agent string
  maxRedirects: 5              // Maximum number of redirects to follow
}
```

#### Methods

##### `testUrl(url: string, options?: TestOptions): Promise<TestResult>`

Tests a single URL and returns detailed performance metrics.

**Parameters:**
- `url`: The URL to test
- `options` (optional): Test configuration options

**Returns:** Promise that resolves to a `TestResult` object

**Example:**
```typescript
const tester = new NetworkTester();
const result = await tester.testUrl('https://api.example.com');
console.log(result.responseTime); // Response time in milliseconds
```

##### `ping(url: string, options?: PingOptions): Promise<PingResult>`

Performs a ping-like test with detailed timing breakdown.

**Parameters:**
- `url`: The URL to ping
- `options` (optional): Ping configuration options

**Returns:** Promise that resolves to a `PingResult` object

**Example:**
```typescript
const tester = new NetworkTester();
const result = await tester.ping('https://api.example.com');
console.log(result.dnsLookupTime); // DNS lookup time in milliseconds
```

##### `testMultiple(urls: string[], options?: TestOptions): Promise<TestResult[]>`

Tests multiple URLs concurrently.

**Parameters:**
- `urls`: Array of URLs to test
- `options` (optional): Test configuration options

**Returns:** Promise that resolves to an array of `TestResult` objects

### Benchmark

Class for running performance benchmarks.

#### Constructor

```typescript
new Benchmark(tester: NetworkTester)
```

#### Methods

##### `run(url: string, count: number, options?: BenchmarkOptions): Promise<BenchmarkResult>`

Runs a benchmark test with specified number of requests.

**Parameters:**
- `url`: The URL to benchmark
- `count`: Number of requests to make
- `options` (optional): Benchmark configuration

**Returns:** Promise that resolves to a `BenchmarkResult` object

## Type Definitions

### TestResult

```typescript
interface TestResult {
  url: string;
  statusCode: number;
  statusText: string;
  responseTime: number;
  success: boolean;
  timestamp: string;
  error?: string;
}
```

### PingResult

```typescript
interface PingResult extends TestResult {
  dnsLookupTime: number;
  tlsHandshakeTime: number;
}
```

### BenchmarkResult

```typescript
interface BenchmarkResult {
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
```

### TestOptions

```typescript
interface TestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  data?: any;
  timeout?: number;
}
```

### BenchmarkOptions

```typescript
interface BenchmarkOptions extends TestOptions {
  concurrency?: number;  // Number of concurrent requests (default: 1)
}
```

## CLI Usage

### Commands

#### `kntl ping <url>`

Ping a URL and measure network performance.

**Options:**
- `-j, --json` - Output results in JSON format
- `-t, --timeout <ms>` - Request timeout in milliseconds

#### `kntl test <urls...>`

Test one or more API endpoints.

**Options:**
- `-m, --method <method>` - HTTP method
- `-d, --data <data>` - JSON payload for requests
- `-H, --header <header>` - Custom headers (repeatable)
- `-j, --json` - Output results in JSON format
- `-t, --timeout <ms>` - Request timeout
- `-b, --benchmark <count>` - Run benchmark with specified request count
- `-c, --concurrency <num>` - Number of concurrent requests

## Examples

### Basic Testing

```bash
# Simple ping test
kntl ping https://api.github.com

# Basic API test
kntl test https://api.github.com/users/octocat

# Multiple URLs
kntl test https://api.github.com https://httpbin.org/status/200
```

### Advanced Testing

```bash
# POST request with data
kntl test https://jsonplaceholder.typicode.com/posts \
  --method POST \
  --data '{"title":"Test","body":"Content","userId":1}'

# Custom headers
kntl test https://api.example.com \
  --header "Authorization: Bearer TOKEN" \
  --header "Content-Type: application/json"

# Benchmark testing
kntl test https://api.example.com --benchmark 100 --concurrency 10
```

### JSON Output

All commands support `--json` flag for structured output:

```bash
kntl ping https://api.example.com --json
```

Output:
```json
{
  "url": "https://api.example.com",
  "statusCode": 200,
  "statusText": "OK",
  "responseTime": 234.5,
  "dnsLookupTime": 23.1,
  "tlsHandshakeTime": 67.8,
  "success": true,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Error Handling

The library provides comprehensive error handling with detailed error messages:

- **Network errors**: Connection timeouts, DNS resolution failures
- **HTTP errors**: 4xx and 5xx status codes with details
- **Validation errors**: Invalid URLs, malformed JSON data
- **Configuration errors**: Invalid options or parameters

All errors include context information to help with debugging.
