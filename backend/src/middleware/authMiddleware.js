import { verifyToken } from '../utils/jwt.js';

/**
 * Require a valid Bearer JWT. Attaches { id, role } to req.user.
 * Responds 401 if missing/invalid.
 */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Missing or malformed Authorization header.' });
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

/**
 * Require the authenticated user to have one of the allowed roles.
 * Use after requireAuth. Responds 403 on mismatch.
 *
 * Example: router.get('/admin/stats', requireAuth, requireRole('ADMIN'), handler)
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role.' });
    }
    next();
  };
}
