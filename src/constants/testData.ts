export const TEST_DATA = {
  USERS: {
    DEFAULT: {
      NAME: 'test user',
      PASSWORD: 'demo123',
      NEW_PASSWORD: 'newdemo123',
      UPDATED_NAME: 'Updated Test User',
      PHONE: '1234567890',
      COMPANY: 'Test Company'
    },
    INVALID: {
      NAME: 'ab', // Too short
      EMAIL: 'wrong@email.com',
      PASSWORD: 'wrongpassword'
    }
  },
  
  VALIDATION: {
    NAME: {
      MIN_LENGTH: 4,
      MAX_LENGTH: 30
    },
    PASSWORD: {
      MIN_LENGTH: 6
    }
  },
  
  MESSAGES: {
    SUCCESS: {
      REGISTRATION: 'User registered successfully',
      LOGIN: 'Login successful',
      PROFILE: 'Profile successful',
      PROFILE_UPDATE: 'Profile updated successful',
      PASSWORD_CHANGE: 'The password was successfully updated',
      FORGOT_PASSWORD: 'Password reset link successfully sent',
      LOGOUT: 'User has been successfully logged out',
      DELETE_ACCOUNT: 'Account successfully deleted'
    },
    ERROR: {
      INVALID_CREDENTIALS: 'Invalid credentials',
      UNAUTHORIZED: 'Access denied. No token provided.',
      MISSING_FIELDS: 'User name must be between 4 and 30 characters'
    }
  }
} as const;

export const HEADERS = {
  CONTENT_TYPE: 'application/json',
  ACCEPT: 'application/json',
  AUTH_TOKEN: 'x-auth-token'
} as const; 