# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-08-02

### Added
- Initial release of KNTL (Key Network Testing Library)
- `ping` command for measuring response time, DNS lookup, and TLS handshake
- `test` command for comprehensive API endpoint testing
- Support for multiple HTTP methods (GET, POST, PUT, DELETE, PATCH)
- Custom headers and JSON payload support
- Multi-endpoint testing with colored output
- Benchmark/stress testing with configurable request counts and concurrency
- JSON output mode for CI/CD integration
- Beautiful CLI output with spinners and colors
- Cross-platform compatibility (Linux, macOS, Windows)
- Comprehensive error handling and validation
- TypeScript support and type definitions
- Jest test suite with good coverage
- ESLint configuration for code quality
- Complete documentation and examples

### Features
- Response time measurement in milliseconds
- DNS lookup time tracking
- TLS handshake time measurement for HTTPS
- HTTP status code and message display
- Request/response time statistics
- Success/failure rate calculations
- Configurable timeouts
- Progress indicators for long-running operations
- Structured JSON output for automation
- Error categorization (DNS, connection, timeout, etc.)

### Technical
- Built with TypeScript for type safety
- Uses Commander.js for CLI framework
- Axios for HTTP requests
- Chalk for colored terminal output
- Ora for spinners and progress indicators
- Jest for testing
- Node.js built-in modules for DNS and TLS operations
- Modular architecture for maintainability
