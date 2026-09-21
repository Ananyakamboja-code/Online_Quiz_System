/**
 * Authentication service (common to all roles).
 *
 * Talks to the real backend (Express + Prisma + JWT) via the shared Axios
 * instance, whose baseURL is http://localhost:8080/api.
 *
 * Endpoints:
 *   POST /auth/register  -> { user, token }
 *   POST /auth/login     -> { user, token }
 *   GET  /auth/me        -> { user }   (requires Bearer token)
 */
import api from './api';

/** Normalize an Axios error into a plain Error with the server's message. */
function toError(err, fallback) {
  const message =
    err?.response?.data?.message || err?.message || fallback || 'Request failed.';
  return new Error(message);
}

/**
 * Create a new account.
 * @param {{ name, email, password, role }} payload
 * @returns {Promise<{ user, token }>}
 */
export async function register(payload) {
  try {
    const { data } = await api.post('/auth/register', payload);
    return data; // { user, token }
  } catch (err) {
    throw toError(err, 'Registration failed.');
  }
}

/**
 * Log in with email + password.
 * @param {{ email, password }} credentials
 * @returns {Promise<{ user, token }>}
 */
export async function login(credentials) {
  try {
    const { data } = await api.post('/auth/login', credentials);
    return data; // { user, token }
  } catch (err) {
    throw toError(err, 'Login failed.');
  }
}

/**
 * Fetch the current user for the stored token (used to bootstrap/validate a
 * session on app load). Returns null if unauthenticated/expired.
 */
export async function me() {
  try {
    const { data } = await api.get('/auth/me');
    return data.user;
  } catch {
    return null;
  }
}

/**
 * Logout. Token is stateless (JWT), so there's no server call needed; the
 * frontend just clears its stored session. Kept async for a consistent API and
 * in case a token-revocation endpoint is added later.
 */
export async function logout() {
  return Promise.resolve();
}
