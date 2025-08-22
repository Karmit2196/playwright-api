export interface EnvironmentConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  apiVersion: string;
}

export const ENVIRONMENTS: Record<string, EnvironmentConfig> = {
  practice: {
    baseUrl: 'https://practice.expandtesting.com',
    timeout: 30000,
    retries: 2,
    apiVersion: 'v1'
  },
  
  staging: {
    baseUrl: 'https://staging.expandtesting.com',
    timeout: 30000,
    retries: 3,
    apiVersion: 'v1'
  },
  
  production: {
    baseUrl: 'https://api.expandtesting.com',
    timeout: 60000,
    retries: 1,
    apiVersion: 'v1'
  }
};

export const getCurrentEnvironment = (): EnvironmentConfig => {
  const env = process.env.TEST_ENV || 'practice';
  return ENVIRONMENTS[env] || ENVIRONMENTS.practice;
};

export const getBaseUrl = (): string => {
  return getCurrentEnvironment().baseUrl;
};

export const getTimeout = (): number => {
  return getCurrentEnvironment().timeout;
};

export const getRetries = (): number => {
  return getCurrentEnvironment().retries;
}; 