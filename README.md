# KNTL - Key Network Testing Library

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)

> **KNTL** – Key Network Testing Library. A lightweight, powerful CLI tool for testing API endpoints and network performance with detailed metrics and benchmarking capabilities.

## 🚀 Features

- **🌐 Network Ping Testing** - Test response times with DNS lookup and TLS handshake metrics
- **🔗 API Endpoint Testing** - Support for GET, POST, PUT, DELETE, PATCH methods
- **📊 Benchmark Testing** - Load testing with concurrent requests and detailed statistics
- **📋 Custom Headers** - Add multiple custom headers for authentication and API testing
- **📄 JSON Payloads** - Send JSON data with POST/PUT requests
- **📈 Detailed Metrics** - Response time, DNS lookup, TLS handshake measurements
- **🎯 Multiple URL Testing** - Test multiple endpoints in a single command
- **📱 JSON Output** - Machine-readable JSON output for integration
- **⚡ Fast & Lightweight** - Built with TypeScript and optimized for performance
- **🛡️ Error Handling** - Robust error handling with meaningful error messages

## 📦 Installation

### Global Installation (Recommended)
```bash
npm install -g kntl
```

### Local Installation
```bash
npm install kntl
```

### From Source
```bash
git clone https://github.com/kenvx/kntl.git
cd kntl
npm install
npm run build
npm link
```

## 🎯 Quick Start

### Basic Ping Test
```bash
# Ping a URL and get response metrics
kntl ping https://api.github.com

# Output with JSON format
kntl ping https://api.github.com --json
```

### API Endpoint Testing
```bash
# Test a GET endpoint
kntl test https://jsonplaceholder.typicode.com/posts/1

# Test multiple endpoints
kntl test https://httpbin.org/get https://httpbin.org/status/200

# Test with JSON output
kntl test https://api.github.com/users/octocat --json
```

### POST Request with Data
```bash
# Send JSON data
kntl test https://httpbin.org/post \
  --method POST \
  --data '{"name":"John","age":30}' \
  --header "Content-Type: application/json"
```

### Benchmark Testing
```bash
# Run 10 requests with 2 concurrent connections
kntl test https://httpbin.org/get --benchmark 10 --concurrency 2

# Benchmark with custom headers
kntl test https://api.example.com/endpoint \
  --benchmark 50 \
  --concurrency 5 \
  --header "Authorization: Bearer your-token"
```

## 📚 Command Reference

### `kntl ping <url>`

Test network connectivity and measure response metrics.

```bash
kntl ping <url> [options]
```

**Options:**
- `-j, --json` - Output results in JSON format
- `-t, --timeout <ms>` - Request timeout in milliseconds (default: 10000)

**Example:**
```bash
kntl ping https://google.com --json --timeout 5000
```

### `kntl test <urls...>`

Test API endpoints with comprehensive options.

```bash
kntl test <urls...> [options]
```

**Options:**
- `-m, --method <method>` - HTTP method (GET, POST, PUT, DELETE, PATCH) (default: GET)
- `-d, --data <data>` - JSON payload for POST/PUT requests
- `-H, --header <header>` - Custom headers (can be used multiple times)
- `-j, --json` - Output results in JSON format
- `-t, --timeout <ms>` - Request timeout in milliseconds (default: 10000)
- `-b, --benchmark <count>` - Run benchmark with specified number of requests
- `-c, --concurrency <num>` - Number of concurrent requests for benchmark (default: 1)

**Examples:**
```bash
# GET request with custom headers
kntl test https://api.example.com/users \
  --header "Authorization: Bearer token123" \
  --header "User-Agent: KNTL/1.0.0"

# POST request with JSON data
kntl test https://api.example.com/users \
  --method POST \
  --data '{"username":"johndoe","email":"john@example.com"}' \
  --header "Content-Type: application/json"

# Benchmark test
kntl test https://api.example.com/health \
  --benchmark 100 \
  --concurrency 10
```

## 📊 Output Examples

### Ping Output
```
✓ https://api.github.com - 200 OK - 1.23s (DNS: 15ms, TLS: 456ms)
```

### JSON Ping Output
```json
{
  "url": "https://api.github.com",
  "statusCode": 200,
  "statusText": "OK",
  "responseTime": 1234.56,
  "dnsLookupTime": 15.23,
  "tlsHandshakeTime": 456.78,
  "success": true,
  "timestamp": "2025-08-02T13:30:00.000Z"
}
```

### Benchmark Output
```
Benchmark Results for https://api.example.com
================================================
Total Requests: 50
Successful: 50
Failed: 0
Success Rate: 100.0%
Timing Statistics:
Average Response Time: 245ms
Fastest Response: 123ms
Slowest Response: 456ms
Requests/Second: 4.08
```

## 🔧 Development

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/kenvx/kntl.git
cd kntl

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run with coverage
npm run test:coverage

# Development mode
npm run dev

# Lint code
npm run lint
npm run lint:fix
```

### Project Structure
```
kntl/
├── src/
│   ├── commands/           # CLI command implementations
│   │   ├── ping.ts        # Ping command
│   │   ├── test.ts        # Test command
│   │   └── utils.ts       # Utility functions
│   ├── core/              # Core functionality
│   │   ├── networkTester.ts  # Network testing logic
│   │   └── benchmark.ts   # Benchmarking logic
│   ├── types/             # TypeScript type definitions
│   ├── __tests__/         # Test files
│   └── index.ts           # Main entry point
├── bin/
│   └── kntl.js           # CLI executable
├── dist/                 # Compiled JavaScript
└── docs/                 # Documentation
```

## 🧪 Testing

The project includes comprehensive tests covering all functionality:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

Current test coverage: **17/17 tests passing** ✅

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**kenvx**

- GitHub: [@kenvx](https://github.com/kenvx)

## 🙏 Acknowledgments

- Built with [Commander.js](https://github.com/tj/commander.js/) for CLI functionality
- Uses [Axios](https://github.com/axios/axios) for HTTP requests
- Styled with [Chalk](https://github.com/chalk/chalk) for colorful output
- Loading indicators by [Ora](https://github.com/sindresorhus/ora)

## 📈 Roadmap

- [ ] Support for HTTP/2 testing
- [ ] WebSocket connection testing
- [ ] SSL certificate validation
- [ ] Response body validation
- [ ] Export results to CSV/XML formats
- [ ] Interactive mode
- [ ] Configuration file support

---

Made with ❤️ by [kenvx](https://github.com/kenvx)