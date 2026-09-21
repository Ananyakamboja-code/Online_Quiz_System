import bcrypt from 'bcryptjs';
import prisma from '../prismaClient.js';
import { ROLES } from '../config.js';
import { signToken } from '../utils/jwt.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Strong password policy (must match the frontend checklist):
 * at least 8 chars, and at least one lowercase, uppercase, number, and symbol.
 * Returns null if valid, else an error message.
 */
function validatePassword(password) {
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (!/[a-z]/.test(password)) return 'Password must include a lowercase letter.';
  if (!/[A-Z]/.test(password)) return 'Password must include an uppercase letter.';
  if (!/[0-9]/.test(password)) return 'Password must include a number.';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Password must include a symbol.';
  return null;
}

/** Strip sensitive fields before returning a user to the client. */
function toSafeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    employeeId: user.employeeId || null,
    department: user.department || null,
  };
}

/**
 * POST /api/auth/register
 * Body: { name, email, password, role }
 * Creates a new account with a bcrypt-hashed password and returns { user, token }.
 */
export async function register(req, res, next) {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const role = String(req.body.role || '').trim().toUpperCase();

    // Validation
    if (!name) return res.status(400).json({ message: 'Name is required.' });
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ message: 'A valid email is required.' });
    }
    const pwError = validatePassword(password);
    if (pwError) {
      return res.status(400).json({ message: pwError });
    }
    if (!ROLES.includes(role)) {
      return res.status(400).json({ message: `Role must be one of: ${ROLES.join(', ')}.` });
    }

    // Uniqueness
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const hash = await bcrypt.hash(password, 10);

    // Auto-generate employee ID for FACULTY on registration.
    let employeeId = null;
    if (role === 'FACULTY') {
      const year = new Date().getFullYear();
      const random = String(Math.floor(1000 + Math.random() * 9000)); // 4-digit
      employeeId = `FAC-${year}-${random}`;
    }

    const user = await prisma.user.create({
      data: { name, email, password: hash, role, ...(employeeId && { employeeId }) },
    });

    const token = signToken(user);
    return res.status(201).json({ user: toSafeUser(user), token });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Verifies credentials and returns { user, token }.
 */
export async function login(req, res, next) {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    // Use the same message for missing user and wrong password to avoid leaking
    // which emails are registered.
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = signToken(user);
    return res.json({ user: toSafeUser(user), token });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me
 * Returns the current user based on the Bearer token (requireAuth sets req.user).
 * Useful for the frontend to bootstrap session on load / validate the token.
 */
export async function me(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.json({ user: toSafeUser(user) });
  } catch (err) {
    next(err);
  }
}
