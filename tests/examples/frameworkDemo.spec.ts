import { test, expect } from '@playwright/test';
import { 
  API_ENDPOINTS, 
  HTTP_STATUS_CODES, 
  TEST_DATA, 
  ApiHelpers,
  TestUtils 
} from '../../src';

test.describe('Framework Demo - Showcasing New Capabilities', () => {
  let apiHelpers: ApiHelpers;
  let testEmail: string;

  test.beforeEach(async ({ request }) => {
    apiHelpers = new ApiHelpers(request);
    testEmail = apiHelpers.generateUniqueEmail();
  });

  test('1. Using Constants Instead of Hardcoded Values', async ({ request }) => {
    TestUtils.logTestStep('Demo: Constants Usage');
    
    // Before: Hardcoded values scattered throughout
    // const response = await request.post('/notes/api/users/register', {
    //   headers: { 'Content-Type': 'application/json' },
    //   data: { name: 'test user', email: 'test@example.com', password: 'demo123' }
    // });
    
    // After: Clean, maintainable constants
    const response = await apiHelpers.registerUser(testEmail);
    
    TestUtils.logResponse(response);
    TestUtils.assertSuccessStatus(response);
    
    console.log('✅ Constants make tests readable and maintainable');
  });

  test('2. Using Helper Methods for Common Operations', async ({ request }) => {
    TestUtils.logTestStep('Demo: Helper Methods');
    
    // First register a user, then login
    const email = apiHelpers.generateUniqueEmail();
    await apiHelpers.registerUser(email);
    
    // Before: Repetitive HTTP setup code
    // const response = await request.post('/notes/api/users/login', {
    //   headers: { 'Content-Type': 'application/json' },
    //   data: { email: email, password: 'demo123' }
    // });
    
    // After: Clean, reusable helper methods
    const response = await apiHelpers.loginUser(email, TEST_DATA.USERS.DEFAULT.PASSWORD);
    
    TestUtils.logResponse(response);
    TestUtils.assertStatus(response, HTTP_STATUS_CODES.OK);
    
    console.log('✅ Helper methods eliminate code duplication');
  });

  test('3. Using Utility Functions for Assertions', async ({ request }) => {
    TestUtils.logTestStep('Demo: Utility Functions');
    
    const response = await apiHelpers.registerUser(apiHelpers.generateUniqueEmail());
    
    // Before: Manual assertions
    // expect(response.status()).toBe(200);
    // expect(response.json().success).toBe(true);
    
    // After: Descriptive utility functions
    TestUtils.assertSuccessStatus(response);
    TestUtils.assertSuccessResponse(await response.json());
    
    console.log('✅ Utility functions make assertions clear and consistent');
  });

  test('4. Environment-Aware Configuration', async ({ request }) => {
    TestUtils.logTestStep('Demo: Environment Configuration');
    
    console.log('Current base URL:', API_ENDPOINTS.USERS.REGISTER);
    console.log('Test data constants:', TEST_DATA.USERS.DEFAULT.NAME);
    console.log('HTTP status constants:', HTTP_STATUS_CODES.OK);
    
    console.log('✅ Environment configuration supports multiple deployment targets');
  });

  test('5. Clean Test Structure with Framework', async ({ request }) => {
    TestUtils.logTestStep('Demo: Clean Test Structure');
    
    // This test demonstrates the complete framework workflow
    const email = apiHelpers.generateUniqueEmail();
    
    // Step 1: Register user
    TestUtils.logTestStep('Step 1: User Registration');
    const registerResponse = await apiHelpers.registerUser(email);
    TestUtils.assertSuccessStatus(registerResponse);
    
    // Step 2: Login user
    TestUtils.logTestStep('Step 2: User Login');
    const loginResponse = await apiHelpers.loginUser(email, TEST_DATA.USERS.DEFAULT.PASSWORD);
    TestUtils.assertStatus(loginResponse, HTTP_STATUS_CODES.OK);
    
    // Step 3: Get profile
    TestUtils.logTestStep('Step 3: Get User Profile');
    const loginBody = await loginResponse.json();
    const profileResponse = await apiHelpers.getUserProfile(loginBody.data.token);
    TestUtils.assertSuccessStatus(profileResponse);
    
    console.log('✅ Framework provides clean, readable test structure');
  });
}); 