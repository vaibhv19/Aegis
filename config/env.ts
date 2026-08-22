import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export interface Config {
  baseUrl: string;
  apiBaseUrl: string;
  envName: string;
  testUserEmail?: string;
  testUserPassword?: string;
}

export const config: Config = {
  baseUrl: process.env.BASE_URL || 'https://trajectory-mu-six.vercel.app',
  apiBaseUrl: process.env.API_BASE_URL || 'https://trajectory-api.duckdns.org',
  envName: process.env.NODE_ENV || 'development',
  testUserEmail: process.env.TEST_USER_EMAIL,
  testUserPassword: process.env.TEST_USER_PASSWORD,
};

// Validate critical configuration
if (!config.baseUrl) {
  throw new Error('BASE_URL environment variable is required');
}
