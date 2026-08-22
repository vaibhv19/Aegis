import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export interface Config {
  baseUrl: string;
  envName: string;
}

export const config: Config = {
  baseUrl: process.env.BASE_URL || 'https://trajectory-mu-six.vercel.app',
  envName: process.env.NODE_ENV || 'development',
};

// Validate critical configuration
if (!config.baseUrl) {
  throw new Error('BASE_URL environment variable is required');
}
