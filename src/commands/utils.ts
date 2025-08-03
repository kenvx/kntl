import chalk from 'chalk';
import { URL } from 'url';
import { TestResult, PingResult, BenchmarkResult } from '../types';

/**
 * Validate URL format
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Add protocol to URL if missing
 */
export function normalizeUrl(url: string): string {
  if (!url.includes('://')) {
    return `https://${url}`;
  }
  return url;
}

/**
 * Format response time with appropriate units
 */
export function formatResponseTime(ms: number): string {
  if (ms < 1000) {
    return `${Math.round(ms)}ms`;
  } else {
    return `${(ms / 1000).toFixed(2)}s`;
  }
}

/**
 * Get status color based on HTTP status code
 */
export function getStatusColor(statusCode?: number): (text: string) => string {
  if (!statusCode) return chalk.red;
  
  if (statusCode >= 200 && statusCode < 300) return chalk.green;
  if (statusCode >= 300 && statusCode < 400) return chalk.yellow;
  if (statusCode >= 400 && statusCode < 500) return chalk.red;
  if (statusCode >= 500) return chalk.magenta;
  
  return chalk.gray;
}

/**
 * Format a single test result for display
 */
export function formatTestResult(result: TestResult): string {
  const statusColor = getStatusColor(result.statusCode);
  const status = result.statusCode ? `${result.statusCode} ${result.statusText}` : 'ERROR';
  const responseTime = formatResponseTime(result.responseTime);
  
  if (result.success) {
    return `${chalk.green('✓')} ${result.url} - ${statusColor(status)} - ${responseTime}`;
  } else {
    return `${chalk.red('✗')} ${result.url} - ${chalk.red(result.error || 'Failed')} - ${responseTime}`;
  }
}

/**
 * Format ping result with additional timing details
 */
export function formatPingResult(result: PingResult): string {
  const baseFormat = formatTestResult(result);
  
  if (result.success) {
    const details = [];
    details.push(`DNS: ${formatResponseTime(result.dnsLookupTime)}`);
    
    if (result.tlsHandshakeTime !== undefined) {
      details.push(`TLS: ${formatResponseTime(result.tlsHandshakeTime)}`);
    }
    
    return `${baseFormat} (${details.join(', ')})`;
  }
  
  return baseFormat;
}

/**
 * Format benchmark results in a table
 */
export function formatBenchmarkResult(result: BenchmarkResult): string {
  const lines = [];
  
  lines.push(chalk.bold(`\nBenchmark Results for ${result.url}`));
  lines.push(chalk.gray('='.repeat(50)));
  
  lines.push(`Total Requests: ${chalk.cyan(result.totalRequests.toString())}`);
  lines.push(`Successful: ${chalk.green(result.successfulRequests.toString())}`);
  lines.push(`Failed: ${chalk.red(result.failedRequests.toString())}`);
  lines.push(`Success Rate: ${chalk.cyan(((result.successfulRequests / result.totalRequests) * 100).toFixed(1))}%`);
  
  lines.push('');
  lines.push(chalk.bold('Timing Statistics:'));
  lines.push(`Average Response Time: ${chalk.cyan(formatResponseTime(result.averageResponseTime))}`);
  lines.push(`Fastest Response: ${chalk.green(formatResponseTime(result.fastestResponseTime))}`);
  lines.push(`Slowest Response: ${chalk.red(formatResponseTime(result.slowestResponseTime))}`);
  lines.push(`Requests/Second: ${chalk.cyan(result.requestsPerSecond.toFixed(2))}`);
  
  return lines.join('\n');
}

/**
 * Create a simple table for multiple results
 */
export function createResultsTable(results: TestResult[]): string {
  const lines = [];
  
  lines.push(chalk.bold('\nTest Results:'));
  lines.push(chalk.gray('-'.repeat(80)));
  
  results.forEach(result => {
    lines.push(formatTestResult(result));
  });
  
  lines.push(chalk.gray('-'.repeat(80)));
  
  const successful = results.filter(r => r.success).length;
  const failed = results.length - successful;
  
  lines.push(`${chalk.green(successful.toString())} successful, ${chalk.red(failed.toString())} failed`);
  
  return lines.join('\n');
}

/**
 * Parse JSON data from string
 */
export function parseJsonData(data: string): object {
  try {
    return JSON.parse(data);
  } catch {
    throw new Error('Invalid JSON data provided');
  }
}

/**
 * Parse headers from string array
 */
export function parseHeaders(headers: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  
  headers.forEach(header => {
    const [key, ...valueParts] = header.split(':');
    if (key && valueParts.length > 0) {
      result[key.trim()] = valueParts.join(':').trim();
    }
  });
  
  return result;
}

/**
 * Show error message with proper formatting
 */
export function showError(message: string): void {
  console.error(chalk.red(`Error: ${message}`));
}

/**
 * Show success message with proper formatting
 */
export function showSuccess(message: string): void {
  console.log(chalk.green(`✓ ${message}`));
}

/**
 * Show warning message with proper formatting
 */
export function showWarning(message: string): void {
  console.warn(chalk.yellow(`⚠ ${message}`));
}
