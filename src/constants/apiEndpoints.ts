export const API_ENDPOINTS = {
  // Health endpoints
  HEALTH: {
    CHECK: '/notes/api/health-check'
  },
  
  // User endpoints
  USERS: {
    REGISTER: '/notes/api/users/register',
    LOGIN: '/notes/api/users/login',
    PROFILE: '/notes/api/users/profile',
    CHANGE_PASSWORD: '/notes/api/users/change-password',
    FORGOT_PASSWORD: '/notes/api/users/forgot-password',
    LOGOUT: '/notes/api/users/logout',
    DELETE_ACCOUNT: '/notes/api/users/delete-account'
  }
} as const;

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
} as const;

export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const; 