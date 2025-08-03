# Contributing to KNTL

We love your input! We want to make contributing to KNTL as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Local Development Setup

1. **Clone and Install:**
   ```bash
   git clone https://github.com/kenvx/kntl.git
   cd kntl
   npm install
   ```

2. **Build and Test:**
   ```bash
   npm run build
   npm test
   ```

3. **Local Testing:**
   ```bash
   npm link
   kntl --help
   ```

4. **Development Workflow:**
   ```bash
   # Make changes to src/
   npm run build
   # Test your changes
   kntl ping google.com
   ```

## Code Style

- Use TypeScript for all new code
- Follow the existing code style (ESLint configuration)
- Write meaningful commit messages
- Add JSDoc comments for new functions

## Testing

- Write tests for new functionality
- Ensure all tests pass: `npm test`
- Check test coverage: `npm run test:coverage`
- Test the CLI manually with various scenarios

## Bug Reports

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/kenvx/kntl/issues).

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Feature Requests

We welcome feature requests! Please provide:

- A clear description of the feature
- Why you think it would be useful
- Example usage scenarios

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to open an issue or reach out to the maintainers.
