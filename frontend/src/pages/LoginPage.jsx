import { useState } from 'react';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLE_HOME, ROLE_OPTIONS } from '../data/authRoles';
import './auth.css';

const ROLE_ICONS = { STUDENT: '🎓', FACULTY: '📚', ADMIN: '🛠️' };

/**
 * Login page for all three roles.
 *
 * The user first picks the role they're signing in as, then enters their
 * credentials. The backend is the source of truth for the actual role — if the
 * account's role doesn't match the selected one, we show a clear message rather
 * than silently sending them somewhere unexpected.
 *
 * On success, redirects to the originally requested page (if any) or the role's
 * home dashboard.
 */
export default function LoginPage() {
  const { login, isAuthenticated, role: currentRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedRole, setSelectedRole] = useState('STUDENT');
  // Prefill the email if we arrived here right after registering.
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // One-time success notice passed from the register page.
  const [notice, setNotice] = useState(location.state?.message || '');
  const [submitting, setSubmitting] = useState(false);

  // Already logged in? Send them to their dashboard.
  if (isAuthenticated) {
    return <Navigate to={ROLE_HOME[currentRole] || '/'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    try {
      const user = await login({ email, password });

      // Friendly guard: the account's real role wins, but if it doesn't match
      // what they picked, tell them instead of surprising them.
      if (user.role !== selectedRole) {
        setError(
          `This account is registered as ${user.role}, not ${selectedRole}. Redirecting to your ${user.role} dashboard.`
        );
      }

      const from = location.state?.from?.pathname;
      const dest = from || ROLE_HOME[user.role] || '/';
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-header">
          <h1 className="h4 auth-brand mb-1">Online Quiz System</h1>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        <div className="auth-card-body">
          {notice && !error && (
            <div className="alert alert-success py-2" role="alert">
              {notice}
            </div>
          )}
          {error && (
            <div className="alert alert-warning py-2" role="alert">
              {error}
            </div>
          )}

          <label className="form-label small text-muted">I am a</label>
          <div className="role-grid">
            {ROLE_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt.value}
                className={`role-option ${selectedRole === opt.value ? 'selected' : ''}`}
                onClick={() => setSelectedRole(opt.value)}
                aria-pressed={selectedRole === opt.value}
              >
                <span className="role-icon">{ROLE_ICONS[opt.value]}</span>
                <span className="role-label">{opt.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                placeholder="you@example.com"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="Your password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 auth-submit"
              disabled={submitting}
            >
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            Don&apos;t have an account? <Link to="/register">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
