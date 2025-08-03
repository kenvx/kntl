#!/usr/bin/env node

/**
 * @fileoverview KNTL - Key Network Testing Library
 * Main CLI entry point for the network testing tool
 * 
 * @author kenvx
 * @version 1.0.0
 * @license MIT
 */

import { Command } from 'commander';
import { createPingCommand } from './commands/ping';
import { createTestCommand } from './commands/test';
import { showError } from './commands/utils';

/**
 * Main CLI program instance
 */
const program = new Command();

// Set up main program
program
  .name('kntl')
  .description('KNTL – Key Network Testing Library. Lightweight CLI tool to test API endpoints and network performance.')
  .version('1.0.0', '-v, --version', 'Display version number');

// Add commands
program.addCommand(createPingCommand());
program.addCommand(createTestCommand());

// Add global error handling
program.exitOverride();

try {
  program.parse();
} catch (error) {
  if (error instanceof Error) {
    showError(error.message);
  } else {
    showError('An unexpected error occurred');
  }
  process.exit(1);
}

// If no command is provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
