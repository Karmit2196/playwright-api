# API Testing Framework

A robust and scalable API testing framework built with Playwright, featuring utilities, constants, and helper methods to eliminate hardcoded values and improve maintainability.

## 🏗️ Framework Structure

```
src/
├── constants/
│   ├── apiEndpoints.ts      # All API endpoints
│   └── testData.ts          # Test data constants
├── config/
│   └── environment.ts       # Environment configuration
├── utils/
│   ├── apiHelpers.ts        # API operation helpers
│   └── testUtils.ts         # Test utility functions
└── index.ts                 # Main export file
```

## 🚀 Key Features

- **Centralized Constants**: All endpoints, test data, and HTTP status codes in one place
- **Environment Management**: Support for multiple environments (practice, staging, production)
- **Reusable Utilities**: Common API operations and assertions
- **Type Safety**: Full TypeScript support with proper interfaces
- **Maintainable Tests**: Clean, readable test code without hardcoded values

## 📦 Installation

```bash
npm install
```

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npx playwright test tests/health/getHealth.spec.ts

# Run tests with specific environment
TEST_ENV=staging npm test

# Run tests in headed mode
npx playwright test --headed
```

## 🔧 Configuration

### Environment Variables

Set `TEST_ENV` to switch between environments:

```bash
export TEST_ENV=staging  # Defaults to 'practice'
```

### Available Environments

- **practice**: `https://practice.expandtesting.com` (default)
- **staging**: `https://staging.expandtesting.com`
- **production**: `https://api.expandtesting.com`

## 📝 Usage Examples

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { 
  API_ENDPOINTS, 
  HTTP_STATUS_CODES, 
  TestUtils,
  ApiHelpers 
} from '../../src';

test('Example Test', async ({ request }) => {
  const apiHelpers = new ApiHelpers(request);
  
  TestUtils.logTestStep('Test Step Name');
  
  const response = await apiHelpers.get(API_ENDPOINTS.USERS.PROFILE);
  
  TestUtils.assertStatus(response, HTTP_STATUS_CODES.OK);
  TestUtils.logResponse(response);
});
```

### Using Constants

```typescript
import { API_ENDPOINTS, TEST_DATA, HTTP_STATUS_CODES } from '../../src';

// Instead of hardcoded values
const response = await request.post('/notes/api/users/register', {
  data: {
    name: 'test user',
    email: 'test@example.com',
    password: 'demo123'
  }
});

// Use constants
const response = await request.post(API_ENDPOINTS.USERS.REGISTER, {
  data: {
    name: TEST_DATA.USERS.DEFAULT.NAME,
    email: email,
    password: TEST_DATA.USERS.DEFAULT.PASSWORD
  }
});
```

### Using API Helpers

```typescript
import { ApiHelpers } from '../../src';

test('User Registration', async ({ request }) => {
  const apiHelpers = new ApiHelpers(request);
  
  // Generate unique email
  const email = apiHelpers.generateUniqueEmail();
  
  // Register user using helper method
  const response = await apiHelpers.registerUser(email);
  
  // Use utility assertions
  TestUtils.assertSuccessStatus(response);
});
```

## 🛠️ Available Utilities

### ApiHelpers Class

- `generateUniqueEmail()`: Generate unique test email
- `post()`, `get()`, `patch()`, `delete()`: HTTP method wrappers
- `createAuthHeaders(token)`: Create authentication headers
- `registerUser(email)`: Register new user
- `loginUser(email, password)`: Login user
- `getUserProfile(token)`: Get user profile
- `updateUserProfile(token, data)`: Update user profile
- `changePassword(token, current, new)`: Change password
- `forgotPassword(email)`: Request password reset
- `logoutUser(token)`: Logout user
- `deleteUserAccount(token)`: Delete user account

### TestUtils Class

- `assertSuccessStatus(response)`: Assert 2xx status
- `assertStatus(response, status)`: Assert specific status
- `assertSuccessResponse(body)`: Assert success response
- `assertErrorResponse(body)`: Assert error response
- `logTestStep(name, details)`: Log test step information
- `logResponse(response, body)`: Log response details

## 🔄 Migration from Old Tests

### Before (Hardcoded)

```typescript
test('User Registration', async ({ request }) => {
  const response = await request.post('/notes/api/users/register', {
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data: {
      name: 'test user',
      email: `test${Date.now()}@gmail.com`,
      password: 'demo123'
    }
  });
  
  expect(response.status()).toBe(200);
  expect(response.json().success).toBe(true);
});
```

### After (Framework-based)

```typescript
test('User Registration', async ({ request }) => {
  const apiHelpers = new ApiHelpers(request);
  
  TestUtils.logTestStep('User Registration');
  
  const email = apiHelpers.generateUniqueEmail();
  const response = await apiHelpers.registerUser(email);
  
  TestUtils.logResponse(response);
  TestUtils.assertSuccessStatus(response);
  TestUtils.assertSuccessResponse(await response.json());
});
```

## 📊 Benefits

1. **Maintainability**: Change endpoints/data in one place
2. **Reusability**: Common operations available across all tests
3. **Readability**: Clear, descriptive test code
4. **Consistency**: Standardized patterns across all tests
5. **Scalability**: Easy to add new endpoints and test scenarios
6. **Environment Support**: Test against different environments easily

## 🚧 Adding New Features

### Adding New Endpoints

1. Add to `src/constants/apiEndpoints.ts`:
```typescript
export const API_ENDPOINTS = {
  // ... existing endpoints
  NEW_FEATURE: {
    CREATE: '/api/new-feature/create',
    GET: '/api/new-feature/:id',
    UPDATE: '/api/new-feature/:id',
    DELETE: '/api/new-feature/:id'
  }
};
```

### Adding New Test Data

1. Add to `src/constants/testData.ts`:
```typescript
export const TEST_DATA = {
  // ... existing data
  NEW_FEATURE: {
    DEFAULT: {
      name: 'Test Feature',
      description: 'Test Description'
    }
  }
};
```

### Adding New Helper Methods

1. Add to `src/utils/apiHelpers.ts`:
```typescript
async createNewFeature(data: any) {
  return await this.post(API_ENDPOINTS.NEW_FEATURE.CREATE, data);
}
```

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper TypeScript types
3. Include JSDoc comments for new methods
4. Update this README for new features
5. Ensure all tests pass

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [API Testing Best Practices](https://playwright.dev/docs/api-testing) 