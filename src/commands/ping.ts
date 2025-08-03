import { Command } from 'commander';
import ora from 'ora';
import { NetworkTester } from '../core/networkTester';
import { 
  validateUrl, 
  normalizeUrl, 
  formatPingResult, 
  showError 
} from './utils';

export function createPingCommand(): Command {
  const command = new Command('ping');
  
  command
    .description('Ping a URL and measure response time, DNS lookup, and TLS handshake')
    .argument('<url>', 'URL to ping')
    .option('-j, --json', 'Output results in JSON format')
    .option('-t, --timeout <ms>', 'Request timeout in milliseconds', '10000')
    .action(async (url: string, options: { json?: boolean; timeout?: string }) => {
      try {
        // Normalize and validate URL
        const normalizedUrl = normalizeUrl(url);
        if (!validateUrl(normalizedUrl)) {
          showError('Invalid URL provided');
          process.exit(1);
        }

        const spinner = ora(`Pinging ${normalizedUrl}...`).start();
        
        const networkTester = new NetworkTester({
          timeout: parseInt(options.timeout || '10000')
        });
        
        const result = await networkTester.ping(normalizedUrl);
        
        spinner.stop();
        
        if (options.json) {
          console.log(JSON.stringify(result, null, 2));
        } else {
          console.log(formatPingResult(result));
          
          if (!result.success) {
            process.exit(1);
          }
        }
      } catch (error) {
        const spinner = ora();
        spinner.stop();
        showError(error instanceof Error ? error.message : 'An unexpected error occurred');
        process.exit(1);
      }
    });

  return command;
}
