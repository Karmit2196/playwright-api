# Playwright API Automation Framework

A clean, scalable API testing framework built with Playwright and TypeScript, designed to eliminate code duplication through simple function-based architecture.


## 📁 Project Structure

```
playwright-api/
├── src/
│   ├── config/
│   │   └── environment.ts          # Environment configuration
│   ├── constants/
│   │   ├── apiEndpoints.ts         # API endpoint definitions
│   │   └── testData.ts             # Test data constants
│   ├── utils/
│   │   ├── apiHelpers.ts           # Main API helper class
│   │   └── testUtils.ts            # Test utility functions
│   └── index.ts                    # Main exports
├── tests/
│   ├── examples/
│   │   └── frameworkDemo.spec.ts   # Framework demonstration
│   ├── health/
│   │   └── getHealth.spec.ts       # Health check tests
│   └── users/
│       └── userWorkflow.spec.ts    # User workflow tests
├── playwright.config.ts             # Playwright configuration
└── package.json                     # Dependencies
```

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/Karmit2196/playwright-api.git
cd playwright-api

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## 🚀 Quick Start

### 1. Configure Environment
```typescript
// src/config/environment.ts
export const ENVIRONMENTS = {
  practice: {
    baseUrl: 'https://your-api.com',
    timeout: 30000,
    retries: 2
  }
};
```

### 2. Write Your First Test
```typescript
import { test, expect } from '@playwright/test';
import { ApiHelpers } from '../../src';

test('Simple API Test', async ({ request }) => {
  const apiHelpers = new ApiHelpers(request);
  
  // Register a user
  const response = await apiHelpers.registerUser('test@example.com');
  
  // Assert response
  expect(response.status()).toBe(201);
});
```

### 3. Run Tests
```bash
# Run all tests
npm test

# Run specific test categories
npm run test:health      # Health check tests only
npm run test:demo        # Framework demo tests only
npm run test:users       # User workflow tests only

# Run with different modes
npm run test:headed      # Headed mode
npm run test:debug       # Debug mode
npm run test:ui          # Playwright UI mode

# Generate and view reports
npm run test:full        # Run tests and generate HTML report
npm run test:report      # Open HTML report
npm run test:results     # Open test results

# Development and CI
npm run lint             # Check code quality
npm run lint:fix         # Fix linting issues
npm run type-check       # TypeScript type checking
npm run ci               # Run type check + tests
npm run clean            # Clean test artifacts
npm run preview          # Run tests and show report
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm test` | Run all tests |
| `npm run test:health` | Run health check tests only |
| `npm run test:demo` | Run framework demo tests only |
| `npm run test:users` | Run user workflow tests only |
| `npm run test:headed` | Run tests in headed mode |
| `npm run test:debug` | Run tests in debug mode |
| `npm run test:ui` | Open Playwright UI |
| `npm run test:full` | Run tests with HTML report |
| `npm run test:report` | Open HTML report |
| `npm run test:results` | Open test results |
| `npm run lint` | Check code quality |
| `npm run lint:fix` | Fix linting issues |
| `npm run type-check` | TypeScript type checking |
| `npm run ci` | Run type check + tests |
| `npm run clean` | Clean test artifacts |
| `npm run preview` | Run tests and show report |
| `npm run report:generate` | Generate enhanced HTML report |
| `npm run report:enhanced` | Run tests + generate enhanced report |
| `npm run report:open` | Open Playwright HTML report |
| `npm run report:custom` | Open custom enhanced report |
| `npm run report:all` | Run tests + generate + open all reports |

## 🔧 Key Components

### ApiHelpers Class
The main class that handles all API interactions:

```typescript
const apiHelpers = new ApiHelpers(request);

// Basic HTTP methods
await apiHelpers.get('/api/users');
await apiHelpers.post('/api/users', userData);
await apiHelpers.patch('/api/users/1', updateData);
await apiHelpers.delete('/api/users/1');

// Business logic methods
await apiHelpers.registerUser(email);
await apiHelpers.loginUser(email, password);
await apiHelpers.getUserProfile(token);
```

### TestUtils Class
Built-in utility functions for common assertions:

```typescript
import { TestUtils } from '../../src';

// Response validation
TestUtils.assertSuccessStatus(response);
TestUtils.assertStatus(response, 200);
TestUtils.assertSuccessResponse(responseBody);

// Test logging
TestUtils.logTestStep('User Registration');
TestUtils.logResponse(response);
```

## 🌍 Environment Management

```bash
# Set environment variable
export TEST_ENV=staging

# Run tests for specific environment
npm test
```

Supported environments: `practice`, `staging`, `production`

## 🚀 GitHub Actions

This repository includes automated workflows for continuous integration and daily testing:

### **CI/CD Pipeline** (`.github/workflows/ci-cd.yml`)
- **Triggers**: Every push to `main`/`develop` branches, every pull request
- **Features**: 
  - Runs tests automatically
  - Type checking and linting
  - Generates test reports
  - Comments on PRs with test results
  - Uploads artifacts for 30 days
  - **Generates HTML reports automatically**

### **Daily Tests** (`.github/workflows/daily-tests.yml`)
- **Triggers**: Daily at 2:00 AM UTC, manual trigger
- **Features**:
  - Runs health checks daily
  - Framework validation
  - Catches issues early
  - Uploads results for 7 days
  - **Generates HTML reports daily**

### **Manual Report Generation** (`.github/workflows/manual-report.yml`)
- **Triggers**: Manual trigger only
- **Features**:
  - Choose test suite to run (all, health, demo, users)
  - Generate enhanced HTML reports on demand
  - Customizable report generation
  - Uploads artifacts for 90 days
  - **Perfect for on-demand reporting**

### **Manual Trigger**
You can manually run any workflow from the GitHub Actions tab in your repository:

1. **Go to Actions tab** in your GitHub repository
2. **Select workflow** you want to run
3. **Click "Run workflow"** button
4. **Configure options** (for manual report generation)
5. **Click "Run workflow"** to start

### **HTML Reports Generated Automatically**
Every workflow run now generates:
- 📊 **Playwright HTML Report** - Standard detailed report
- 🎨 **Enhanced Custom Report** - Beautiful branded report
- 📄 **JSON Results** - Machine-readable data
- 📋 **JUnit XML** - Standard CI/CD format

## 📊 Test Reports

After running tests, view detailed reports:

```bash
# Open HTML report
npx playwright show-report

# Open test results
npx playwright show-report test-results/

# Generate enhanced custom report
npm run report:generate

# Run tests and generate enhanced report
npm run report:enhanced

# Open all reports
npm run report:all
```

### **Report Types Available:**

1. **Standard Playwright Report** - Built-in HTML report with detailed test information
2. **Custom Enhanced Report** - Beautiful, branded report with framework-specific styling
3. **JSON Results** - Machine-readable test results for CI/CD integration
4. **JUnit XML** - Standard format for test reporting tools

### **HTML Report Features:**
- 🎨 **Beautiful Design** - Modern, responsive UI with gradients and animations
- 📊 **Comprehensive Stats** - Pass/fail counts, duration, success rates
- 🔍 **Quick Navigation** - Easy access to detailed results and artifacts
- 📱 **Mobile Friendly** - Responsive design for all devices
- 🌐 **Cross-Platform** - Works on Windows, Mac, and Linux

## 🎯 Benefits

- **Simple & Understandable** - No complex concepts, just functions
- **Maintainable** - Change one function, affects everything
- **Scalable** - Easy to add new features
- **Consistent** - All API calls follow the same pattern
- **Well-Tested** - Comprehensive test coverage included

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For questions or issues, please open an issue on GitHub or contact the maintainers.