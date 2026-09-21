import jwt from 'jsonwebtoken';
import { config } from '../config.js';

/**
 * Sign a JWT for an authenticated user.
 * Keep the payload minimal: id + role are enough for authz decisions.
 */
export function signToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

/**
 * Verify and decode a JWT. Throws if invalid/expired.
 */
export function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret);
}
