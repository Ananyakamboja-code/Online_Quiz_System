import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService';

/**
 * Common authentication context for all three roles.
 *
 * Holds the current user + role + token, persists them to localStorage so a
 * page refresh keeps the session, and exposes register/login/logout. This is
 * the single source of truth the guards and layouts read from.
 *
 * Backed by the real backend (Express + Prisma + JWT) through authService.
 * On load it validates the stored token against GET /auth/me and clears the
 * session if the token is invalid/expired.
 */
const AuthContext = createContext(null);

const STORAGE_KEY = 'oqs.auth';

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  // Initialize from storage so a refresh doesn't log the user out.
  const [auth, setAuth] = useState(() => readStored());
  // While we validate an existing token, avoid rendering guarded content early.
  const [bootstrapping, setBootstrapping] = useState(Boolean(readStored()?.token));

  // Keep storage in sync with state.
  useEffect(() => {
    if (auth) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [auth]);

  // On mount: if we have a token, confirm it's still valid via /auth/me.
  // Skipped when no backend is running to avoid network errors.
  useEffect(() => {
    let cancelled = false;
    const stored = readStored();
    if (!stored?.token) {
      setBootstrapping(false);
      return;
    }
    authService
      .me()
      .then((user) => {
        if (cancelled) return;
        if (user) {
          setAuth((prev) => (prev ? { ...prev, user } : { user, token: stored.token }));
        } else {
          setAuth(null); // token invalid/expired
        }
      })
      .catch(() => {
        // Backend not running — clear stale session silently.
        if (!cancelled) setAuth(null);
      })
      .finally(() => {
        if (!cancelled) setBootstrapping(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const register = async (payload) => {
    // Create the account but do NOT log the user in. The backend returns a
    // token, but we intentionally discard it so the user goes to the login
    // page and signs in manually before reaching their dashboard.
    const { user } = await authService.register(payload);
    return user;
  };

  const login = async (credentials) => {
    const { user, token } = await authService.login(credentials);
    setAuth({ user, token });
    return user; // caller can redirect based on role
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setAuth(null);
    }
  };

  const value = useMemo(
    () => ({
      user: auth?.user || null,
      role: auth?.user?.role || null,
      token: auth?.token || null,
      isAuthenticated: Boolean(auth?.token),
      bootstrapping,
      register,
      login,
      logout,
    }),
    [auth, bootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Hook for consuming auth state anywhere in the app. */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

/**
 * Read the persisted token without React (used by the Axios interceptor).
 */
export function getStoredToken() {
  return readStored()?.token || null;
}
