import { test, expect } from '@playwright/test';
import { 
  API_ENDPOINTS, 
  HTTP_STATUS_CODES, 
  TEST_DATA, 
  ApiHelpers,
  TestUtils 
} from '../../src';

test.describe('Simple Functions Demo - No Complex Middleware', () => {
  let apiHelpers: ApiHelpers;
  let testEmail: string;

  test.beforeEach(async ({ request }) => {
    apiHelpers = new ApiHelpers(request);
    testEmail = apiHelpers.generateUniqueEmail();
  });

  test('1. Simple Functions - No Code Duplication', async ({ request }) => {
    TestUtils.logTestStep('Demo: Simple Functions');
    
    // Now every request automatically gets logged and handled by simple functions
    // No complex middleware, just regular functions!
    const response = await apiHelpers.registerUser(testEmail);
    
    TestUtils.logResponse(response);
    TestUtils.assertSuccessStatus(response);
    
    console.log('✅ Simple functions eliminate code duplication');
  });

  test('2. Easy to Understand - Step by Step', async ({ request }) => {
    TestUtils.logTestStep('Demo: Easy to Understand');
    
    // The makeRequest method now has clear, simple steps:
    // Step 1: Log request
    // Step 2: Setup headers  
    // Step 3: Add auth
    // Step 4: Make request
    // Step 5: Log response
    
    const response = await apiHelpers.registerUser(testEmail);
    TestUtils.assertSuccessStatus(response);
    
    console.log('✅ Code is now simple and easy to understand');
  });

  test('3. Easy to Modify - Change One Function', async ({ request }) => {
    TestUtils.logTestStep('Demo: Easy to Modify');
    
    // Want to change how logging works? Just modify the logRequest function!
    // Want to change how headers are set? Just modify the setupHeaders function!
    // No complex pipeline, just simple function calls!
    
    const response = await apiHelpers.registerUser(testEmail);
    TestUtils.assertSuccessStatus(response);
    
    console.log('✅ Easy to modify - just change the function you want');
  });

  test('4. Clean and Simple - No Fancy Concepts', async ({ request }) => {
    TestUtils.logTestStep('Demo: Clean and Simple');
    
    // Look how clean these method calls are now!
    const email = apiHelpers.generateUniqueEmail();
    
    // Step 1: Register user (automatically logged, headers set, etc.)
    const registerResponse = await apiHelpers.registerUser(email);
    TestUtils.assertSuccessStatus(registerResponse);
    
    // Step 2: Login user (automatically logged, headers set, etc.)
    const loginResponse = await apiHelpers.loginUser(email, TEST_DATA.USERS.DEFAULT.PASSWORD);
    TestUtils.assertStatus(loginResponse, HTTP_STATUS_CODES.OK);
    
    // Step 3: Get profile (automatically logged, headers set, etc.)
    const loginBody = await loginResponse.json();
    apiHelpers.setAuthToken(loginBody.data.token);
    const profileResponse = await apiHelpers.getUserProfile(loginBody.data.token);
    TestUtils.assertSuccessStatus(profileResponse);
    
    console.log('✅ Code is now clean, simple, and easy to understand');
  });
}); 