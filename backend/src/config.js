import dotenv from 'dotenv';

dotenv.config();

/**
 * Centralized config, read once from the environment.
 * Fails fast if a required secret is missing.
 */
export const config = {
  port: Number(process.env.PORT) || 8080,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
};

if (!config.jwtSecret) {
  // Refuse to start without a signing secret — tokens would be insecure.
  throw new Error('JWT_SECRET is not set. Add it to backend/.env');
}

// Valid RBAC roles. Registration is restricted to these.
export const ROLES = ['STUDENT', 'FACULTY', 'ADMIN'];
