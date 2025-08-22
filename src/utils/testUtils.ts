import { APIResponse, expect } from '@playwright/test';
import { HTTP_STATUS_CODES } from '../constants/apiEndpoints';
import { TEST_DATA } from '../constants/testData';

export class TestUtils {
  /**
   * Assert response status is successful (2xx)
   */
  static assertSuccessStatus(response: APIResponse) {
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(300);
  }

  /**
   * Assert response status matches expected status
   */
  static assertStatus(response: APIResponse, expectedStatus: number) {
    expect(response.status()).toBe(expectedStatus);
  }

  /**
   * Assert response body has success property
   */
  static assertSuccessResponse(responseBody: any) {
    expect(responseBody.success).toBe(true);
  }

  /**
   * Assert response body has error property
   */
  static assertErrorResponse(responseBody: any) {
    expect(responseBody.success).toBe(false);
  }

  /**
   * Assert response body structure for user profile
   */
  static assertUserProfileStructure(responseBody: any, expectedEmail: string, expectedName: string, expectedId: string) {
    expect(responseBody.success).toBe(true);
    expect(responseBody.status).toBe(HTTP_STATUS_CODES.OK);
    expect(responseBody.message).toBe(TEST_DATA.MESSAGES.SUCCESS.PROFILE);
    expect(responseBody.data.email).toBe(expectedEmail);
    expect(responseBody.data.name).toBe(expectedName);
    expect(responseBody.data.id).toBe(expectedId);
  }

  /**
   * Assert login response structure
   */
  static assertLoginResponseStructure(responseBody: any) {
    expect(responseBody.success).toBe(true);
    expect(responseBody.status).toBe(HTTP_STATUS_CODES.OK);
    expect(responseBody.message).toBe(TEST_DATA.MESSAGES.SUCCESS.LOGIN);
    expect(responseBody.data).toHaveProperty('token');
    expect(responseBody.data).toHaveProperty('id');
  }

  /**
   * Assert registration response structure
   */
  static assertRegistrationResponseStructure(responseBody: any) {
    expect(responseBody.success).toBe(true);
  }

  /**
   * Assert profile update response structure
   */
  static assertProfileUpdateResponseStructure(responseBody: any, expectedName: string, expectedPhone: string, expectedCompany: string) {
    expect(responseBody.success).toBe(true);
    expect(responseBody.status).toBe(HTTP_STATUS_CODES.OK);
    expect(responseBody.message).toBe(TEST_DATA.MESSAGES.SUCCESS.PROFILE_UPDATE);
    expect(responseBody.data.name).toBe(expectedName);
    expect(responseBody.data.phone).toBe(expectedPhone);
    expect(responseBody.data.company).toBe(expectedCompany);
  }

  /**
   * Assert password change response structure
   */
  static assertPasswordChangeResponseStructure(responseBody: any) {
    expect(responseBody.success).toBe(true);
    expect(responseBody.message).toBe(TEST_DATA.MESSAGES.SUCCESS.PASSWORD_CHANGE);
  }

  /**
   * Assert forgot password response structure
   */
  static assertForgotPasswordResponseStructure(responseBody: any) {
    expect(responseBody.success).toBe(true);
    expect(responseBody.message).toContain(TEST_DATA.MESSAGES.SUCCESS.FORGOT_PASSWORD);
  }

  /**
   * Assert logout response structure
   */
  static assertLogoutResponseStructure(responseBody: any) {
    expect(responseBody.success).toBe(true);
    expect(responseBody.status).toBe(HTTP_STATUS_CODES.OK);
    expect(responseBody.message).toBe(TEST_DATA.MESSAGES.SUCCESS.LOGOUT);
  }

  /**
   * Assert delete account response structure
   */
  static assertDeleteAccountResponseStructure(responseBody: any) {
    expect(responseBody.success).toBe(true);
    expect(responseBody.message).toBe(TEST_DATA.MESSAGES.SUCCESS.DELETE_ACCOUNT);
  }

  /**
   * Assert error response structure for invalid credentials
   */
  static assertInvalidCredentialsError(responseBody: any) {
    expect(responseBody.success).toBe(false);
    expect(responseBody.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
  }

  /**
   * Assert error response structure for unauthorized access
   */
  static assertUnauthorizedError(responseBody: any) {
    expect(responseBody.success).toBe(false);
    expect(responseBody.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
  }

  /**
   * Assert error response structure for bad request
   */
  static assertBadRequestError(responseBody: any) {
    expect(responseBody.success).toBe(false);
    expect(responseBody.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST);
  }

  /**
   * Log test step information
   */
  static logTestStep(stepName: string, details?: any) {
    console.log(`=== ${stepName} ===`);
    if (details) {
      console.log(details);
    }
  }

  /**
   * Log response information
   */
  static logResponse(response: APIResponse, responseBody?: any) {
    console.log(`Status: ${response.status()}`);
    if (responseBody) {
      console.log('Response:', responseBody);
    }
  }
} 