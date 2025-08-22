import { test, expect } from '@playwright/test';
import { API_ENDPOINTS, HTTP_STATUS_CODES, TestUtils } from '../../src';

test('Health Check API', async ({ request }) => {
  const response = await request.get(API_ENDPOINTS.HEALTH.CHECK);
  
  TestUtils.logResponse(response);
  
  // Assert status code
  TestUtils.assertStatus(response, HTTP_STATUS_CODES.OK);
  
  // Assert response body
  const responseBody = await response.json();
  expect(responseBody).toEqual({
    success: true,
    status: 200,
    message: "Notes API is Running"
  });
});

