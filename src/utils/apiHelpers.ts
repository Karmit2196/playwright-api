import { APIRequestContext } from '@playwright/test';
import { API_ENDPOINTS, HTTP_METHODS } from '../constants/apiEndpoints';
import { HEADERS } from '../constants/testData';
import { TEST_DATA } from '../constants/testData';

export class ApiHelpers {
  private authToken?: string;

  constructor(private request: APIRequestContext) {}

  /**
   * Simple function to setup common headers
   */
  private setupHeaders(customHeaders?: Record<string, string>) {
    return {
      accept: HEADERS.ACCEPT,
      'Content-Type': HEADERS.CONTENT_TYPE,
      ...customHeaders
    };
  }

  /**
   * Simple function to log requests
   */
  private logRequest(method: string, endpoint: string, data?: any) {
    console.log(`🚀 ${method} ${endpoint}`);
    if (data) {
      console.log(`📤 Request Data:`, data);
    }
  }

  /**
   * Simple function to log responses
   */
  private logResponse(method: string, endpoint: string, response: any) {
    console.log(`✅ ${method} ${endpoint} - ${response.status()}`);
  }

  /**
   * Simple function to add auth token to headers
   */
  private addAuthToHeaders(headers: Record<string, string>): Record<string, string> {
    if (this.authToken) {
      return { ...headers, 'Authorization': `Bearer ${this.authToken}` };
    }
    return headers;
  }

  /**
   * Central method that uses simple functions to avoid duplication
   */
  private async makeRequest(method: string, endpoint: string, data?: any, customHeaders?: Record<string, string>) {
    // Step 1: Log the request
    this.logRequest(method, endpoint, data);
    
    // Step 2: Setup headers
    const headers = this.setupHeaders(customHeaders);
    
    // Step 3: Add auth if we have a token
    const finalHeaders = this.addAuthToHeaders(headers);
    
    // Step 4: Make the actual request
    let response;
    switch (method.toUpperCase()) {
      case 'GET':
        response = await this.request.get(endpoint, { headers: finalHeaders });
        break;
      case 'POST':
        response = await this.request.post(endpoint, { headers: finalHeaders, data });
        break;
      case 'PATCH':
        response = await this.request.patch(endpoint, { headers: finalHeaders, data });
        break;
      case 'DELETE':
        response = await this.request.delete(endpoint, { headers: finalHeaders });
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
    
    // Step 5: Log the response
    this.logResponse(method, endpoint, response);
    
    return response;
  }

  /**
   * Generate a unique email for testing
   */
  generateUniqueEmail(): string {
    const timestamp = Date.now();
    return `test${timestamp}@gmail.com`;
  }

  /**
   * Make a POST request with common headers
   */
  async post(endpoint: string, data: any, customHeaders?: Record<string, string>) {
    return await this.makeRequest('POST', endpoint, data, customHeaders);
  }

  /**
   * Make a GET request with common headers
   */
  async get(endpoint: string, customHeaders?: Record<string, string>) {
    return await this.makeRequest('GET', endpoint, undefined, customHeaders);
  }

  /**
   * Make a PATCH request with common headers
   */
  async patch(endpoint: string, data: any, customHeaders?: Record<string, string>) {
    return await this.makeRequest('PATCH', endpoint, data, customHeaders);
  }

  /**
   * Make a DELETE request with common headers
   */
  async delete(endpoint: string, customHeaders?: Record<string, string>) {
    return await this.makeRequest('DELETE', endpoint, undefined, customHeaders);
  }

  /**
   * Create auth headers with token
   */
  createAuthHeaders(token: string): Record<string, string> {
    return {
      [HEADERS.AUTH_TOKEN]: token
    };
  }

  /**
   * Set authentication token for all future requests
   */
  setAuthToken(token: string): void {
    this.authToken = token;
  }

  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    this.authToken = undefined;
  }

  /**
   * Register a new user and return user data
   */
  async registerUser(email: string) {
    const response = await this.post(API_ENDPOINTS.USERS.REGISTER, {
      name: TEST_DATA.USERS.DEFAULT.NAME,
      email,
      password: TEST_DATA.USERS.DEFAULT.PASSWORD
    });

    return response;
  }

  /**
   * Login user and return auth data
   */
  async loginUser(email: string, password: string) {
    const response = await this.post(API_ENDPOINTS.USERS.LOGIN, {
      email,
      password
    });

    return response;
  }

  /**
   * Get user profile with auth token
   */
  async getUserProfile(token: string) {
    return await this.get(API_ENDPOINTS.USERS.PROFILE, this.createAuthHeaders(token));
  }

  /**
   * Update user profile
   */
  async updateUserProfile(token: string, updateData: any) {
    return await this.patch(API_ENDPOINTS.USERS.PROFILE, updateData, this.createAuthHeaders(token));
  }

  /**
   * Change user password
   */
  async changePassword(token: string, currentPassword: string, newPassword: string) {
    return await this.post(API_ENDPOINTS.USERS.CHANGE_PASSWORD, {
      currentPassword,
      newPassword
    }, this.createAuthHeaders(token));
  }

  /**
   * Request password reset
   */
  async forgotPassword(email: string) {
    return await this.post(API_ENDPOINTS.USERS.FORGOT_PASSWORD, { email });
  }

  /**
   * Logout user
   */
  async logoutUser(token: string) {
    return await this.delete(API_ENDPOINTS.USERS.LOGOUT, this.createAuthHeaders(token));
  }

  /**
   * Delete user account
   */
  async deleteUserAccount(token: string) {
    return await this.delete(API_ENDPOINTS.USERS.DELETE_ACCOUNT, this.createAuthHeaders(token));
  }

  /**
   * Make a request without authentication (for testing unauthorized scenarios)
   */
  async makeUnauthorizedRequest(method: string, endpoint: string, data?: any) {
    // Use makeRequest but skip auth token addition
    return await this.makeRequestWithoutAuth(method, endpoint, data);
  }

  /**
   * Make a request with invalid/missing data (for testing bad request scenarios)
   */
  async makeInvalidDataRequest(method: string, endpoint: string, invalidData?: any) {
    // Use makeRequest but with invalid data
    return await this.makeRequest(method, endpoint, invalidData);
  }

  /**
   * Private method to make request without authentication
   */
  private async makeRequestWithoutAuth(method: string, endpoint: string, data?: any, customHeaders?: Record<string, string>) {
    // Step 1: Log the request
    this.logRequest(method, endpoint, data);
    
    // Step 2: Setup headers (but skip auth)
    const headers = this.setupHeaders(customHeaders);
    
    // Step 3: Make the actual request (no auth token)
    let response;
    switch (method.toUpperCase()) {
      case 'GET':
        response = await this.request.get(endpoint, { headers });
        break;
      case 'POST':
        response = await this.request.post(endpoint, { headers, data });
        break;
      case 'PATCH':
        response = await this.request.patch(endpoint, { headers, data });
        break;
      case 'DELETE':
        response = await this.request.delete(endpoint, { headers });
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
    
    // Step 4: Log the response
    this.logResponse(method, endpoint, response);
    
    return response;
  }
} 