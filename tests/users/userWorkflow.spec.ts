import { test, expect } from '@playwright/test';
import { 
  API_ENDPOINTS, 
  HTTP_STATUS_CODES, 
  TEST_DATA, 
  HEADERS,
  ApiHelpers,
  TestUtils 
} from '../../src';

// Shared test data and state
let authToken: string;
let userEmail: string;
let userId: string;
let apiHelpers: ApiHelpers;

test.beforeEach(async ({ request }) => {
  apiHelpers = new ApiHelpers(request);
});

test.describe('User Authentication Workflow', () => {
    
  test('1. User Registration', async ({ request }) => {
    TestUtils.logTestStep('User Registration');
    
    userEmail = apiHelpers.generateUniqueEmail();
    const response = await apiHelpers.registerUser(userEmail);
    
    TestUtils.logResponse(response);
    
    // Assert status code (200 or 201 are both valid for registration)
    expect([HTTP_STATUS_CODES.OK, HTTP_STATUS_CODES.CREATED]).toContain(response.status());
    
    const responseBody = await response.json();
    TestUtils.assertRegistrationResponseStructure(responseBody);
  });
    
  test('2. User Login', async ({ request }) => {
    TestUtils.logTestStep('User Login');
    
    const response = await apiHelpers.loginUser(userEmail, TEST_DATA.USERS.DEFAULT.PASSWORD);
    
    TestUtils.logResponse(response);
    
    // Assert status code
    TestUtils.assertStatus(response, HTTP_STATUS_CODES.OK);
    
    const responseBody = await response.json();
    TestUtils.assertLoginResponseStructure(responseBody);
    
    // Store token and user ID for subsequent tests
    authToken = responseBody.data.token;
    userId = responseBody.data.id;
    
    console.log('Auth token received:', authToken.substring(0, 20) + '...');
    console.log('User ID:', userId);
  });
    
  test('3. Get User Profile (Authenticated)', async ({ request }) => {
    TestUtils.logTestStep('Get User Profile');
    
    const response = await apiHelpers.getUserProfile(authToken);
    
    TestUtils.logResponse(response);
    
    // Assert status code
    TestUtils.assertStatus(response, HTTP_STATUS_CODES.OK);
    
    const responseBody = await response.json();
    TestUtils.assertUserProfileStructure(
      responseBody, 
      userEmail, 
      TEST_DATA.USERS.DEFAULT.NAME, 
      userId
    );
  });
    
  test('4. Update User Profile', async ({ request }) => {
    TestUtils.logTestStep('Update User Profile');
    
    const updateData = {
      name: TEST_DATA.USERS.DEFAULT.UPDATED_NAME,
      phone: TEST_DATA.USERS.DEFAULT.PHONE,
      company: TEST_DATA.USERS.DEFAULT.COMPANY
    };
    
    const response = await apiHelpers.updateUserProfile(authToken, updateData);
    
    TestUtils.logResponse(response);
    
    // Assert status code
    TestUtils.assertStatus(response, HTTP_STATUS_CODES.OK);
    
    const responseBody = await response.json();
    TestUtils.assertProfileUpdateResponseStructure(
      responseBody,
      TEST_DATA.USERS.DEFAULT.UPDATED_NAME,
      TEST_DATA.USERS.DEFAULT.PHONE,
      TEST_DATA.USERS.DEFAULT.COMPANY
    );
  });
    
  test('5. Change Password', async ({ request }) => {
    TestUtils.logTestStep('Change Password');
    
    const response = await apiHelpers.changePassword(
      authToken,
      TEST_DATA.USERS.DEFAULT.PASSWORD,
      TEST_DATA.USERS.DEFAULT.NEW_PASSWORD
    );
    
    TestUtils.logResponse(response);
    
    // Assert status code
    TestUtils.assertStatus(response, HTTP_STATUS_CODES.OK);
    
    const responseBody = await response.json();
    TestUtils.assertPasswordChangeResponseStructure(responseBody);
  });
    
  test('6. Login with New Password', async ({ request }) => {
    TestUtils.logTestStep('Login with New Password');
    
    const response = await apiHelpers.loginUser(userEmail, TEST_DATA.USERS.DEFAULT.NEW_PASSWORD);
    
    TestUtils.logResponse(response);
    
    // Assert status code
    TestUtils.assertStatus(response, HTTP_STATUS_CODES.OK);
    
    const responseBody = await response.json();
    TestUtils.assertLoginResponseStructure(responseBody);
    
    // Update token for subsequent tests
    authToken = responseBody.data.token;
  });
    
  test('7. Forgot Password', async ({ request }) => {
    TestUtils.logTestStep('Forgot Password');
    
    const response = await apiHelpers.forgotPassword(userEmail);
    
    TestUtils.logResponse(response);
    
    // Assert status code
    TestUtils.assertStatus(response, HTTP_STATUS_CODES.OK);
    
    const responseBody = await response.json();
    TestUtils.assertForgotPasswordResponseStructure(responseBody);
  });
    
  test('8. User Logout', async ({ request }) => {
    TestUtils.logTestStep('User Logout');
    
    const response = await apiHelpers.logoutUser(authToken);
    
    TestUtils.logResponse(response);
    
    // Assert status code
    TestUtils.assertStatus(response, HTTP_STATUS_CODES.OK);
    
    const responseBody = await response.json();
    TestUtils.assertLogoutResponseStructure(responseBody);
  });
    
  test('9. Delete User Account', async ({ request }) => {
    TestUtils.logTestStep('Delete User Account');
    
    // First login again since we logged out
    const loginResponse = await apiHelpers.loginUser(userEmail, TEST_DATA.USERS.DEFAULT.NEW_PASSWORD);
    
    TestUtils.logResponse(loginResponse, 'Login for delete account');
    expect(loginResponse.status()).toBe(HTTP_STATUS_CODES.OK);
    
    const loginBody = await loginResponse.json();
    const deleteToken = loginBody.data.token;
    
    // Now delete the account
    const response = await apiHelpers.deleteUserAccount(deleteToken);
    
    TestUtils.logResponse(response);
    
    // Assert status code
    TestUtils.assertStatus(response, HTTP_STATUS_CODES.OK);
    
    const responseBody = await response.json();
    TestUtils.assertDeleteAccountResponseStructure(responseBody);
  });
});

test.describe('Error Scenarios', () => {
    
  test('10. Login with Invalid Credentials', async ({ request }) => {
    TestUtils.logTestStep('Invalid Login');
    
    const response = await apiHelpers.loginUser(
      TEST_DATA.USERS.INVALID.EMAIL,
      TEST_DATA.USERS.INVALID.PASSWORD
    );
    
    TestUtils.logResponse(response);
    
    // Assert status code
    TestUtils.assertStatus(response, HTTP_STATUS_CODES.UNAUTHORIZED);
    
    const responseBody = await response.json();
    TestUtils.assertInvalidCredentialsError(responseBody);
  });
    
  test('11. Access Profile Without Token', async ({ request }) => {
    TestUtils.logTestStep('Unauthorized Profile Access');
    
    // Now using ApiHelpers instead of direct request
    const response = await apiHelpers.makeUnauthorizedRequest('GET', API_ENDPOINTS.USERS.PROFILE);
    
    TestUtils.logResponse(response);
    
    // Assert status code
    TestUtils.assertStatus(response, HTTP_STATUS_CODES.UNAUTHORIZED);
    
    const responseBody = await response.json();
    TestUtils.assertUnauthorizedError(responseBody);
  });
    
  test('12. Bad Request - Missing Required Fields', async ({ request }) => {
    TestUtils.logTestStep('Bad Request - Missing Required Fields');
    
    // Now using ApiHelpers instead of direct request
    const response = await apiHelpers.makeInvalidDataRequest('POST', API_ENDPOINTS.USERS.REGISTER, {
      // Missing required fields - this will trigger a bad request
    });
    
    TestUtils.logResponse(response);
    
    // Assert status code
    TestUtils.assertStatus(response, HTTP_STATUS_CODES.BAD_REQUEST);
    
    const responseBody = await response.json();
    TestUtils.assertBadRequestError(responseBody);
    
    // Check specific error message
    expect(responseBody.message).toBe(TEST_DATA.MESSAGES.ERROR.MISSING_FIELDS);
  });
}); 