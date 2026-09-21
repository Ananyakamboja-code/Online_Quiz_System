import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLE_HOME, ROLE_OPTIONS } from '../data/authRoles';
import { PASSWORD_RULES, checkPassword, isPasswordValid } from '../utils/passwordPolicy';
import './auth.css';

const ROLE_ICONS = { STUDENT: '🎓', FACULTY: '📚', ADMIN: '🛠️' };

/**
 * Create Account page.
 *
 * The user picks their role, then provides name/email/password. On success the
 * backend returns a token and the user is logged in and sent to their
 * dashboard. All validation errors come from the backend (single source of
 * truth) plus a couple of quick client-side checks for good UX.
 */
export default function RegisterPage() {
  const { register, isAuthenticated, role: currentRole } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('STUDENT');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={ROLE_HOME[currentRole] || '/'} replace />;
  }

  // Live password checklist state.
  const pwChecks = checkPassword(password);
  const pwValid = isPasswordValid(password);
  const passwordsMatch = password.length > 0 && password === confirm;
  const canSubmit =
    name.trim() && email.trim() && pwValid && passwordsMatch && !submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Please enter your name.');
    if (!email.trim()) return setError('Please enter your email.');
    if (!pwValid) {
      return setError('Please meet all password requirements.');
    }
    if (password !== confirm) {
      return setError('Passwords do not match.');
    }

    setSubmitting(true);
    try {
      await register({ name, email, password, role });
      // Account created — send them to login to sign in manually. Pass the
      // email + a success message so the login page can greet/prefill.
      navigate('/login', {
        replace: true,
        state: {
          registered: true,
          email,
          message: 'Account created successfully. Please sign in to continue.',
        },
      });
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-header">
          <h1 className="h4 auth-brand mb-1">Create your account</h1>
          <p className="auth-subtitle">Join the Online Quiz System</p>
        </div>

        <div className="auth-card-body">
          {error && (
            <div className="alert alert-danger py-2" role="alert">
              {error}
            </div>
          )}

          <label className="form-label small text-muted">Register as</label>
          <div className="role-grid">
            {ROLE_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt.value}
                className={`role-option ${role === opt.value ? 'selected' : ''}`}
                onClick={() => setRole(opt.value)}
                aria-pressed={role === opt.value}
                title={opt.description}
              >
                <span className="role-icon">{ROLE_ICONS[opt.value]}</span>
                <span className="role-label">{opt.label}</span>
                <span className="role-desc">{opt.description}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="Jane Doe"
              />
            </div>

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
                autoComplete="email"
                placeholder="you@example.com"
              />
            </div>

            <div className="row">
              <div className="col-sm-6 mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                />
              </div>
              <div className="col-sm-6 mb-3">
                <label htmlFor="confirm" className="form-label">
                  Confirm Password
                </label>
                <input
                  id="confirm"
                  type="password"
                  className={`form-control ${
                    confirm.length > 0 && !passwordsMatch ? 'is-invalid' : ''
                  }`}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                />
                {confirm.length > 0 && !passwordsMatch && (
                  <div className="invalid-feedback">Passwords do not match.</div>
                )}
              </div>
            </div>

            {/* Live password requirement checklist — each ticks off as met. */}
            <ul className="password-checklist mb-3">
              {PASSWORD_RULES.map((rule) => {
                const met = pwChecks[rule.key];
                return (
                  <li
                    key={rule.key}
                    className={met ? 'met' : 'unmet'}
                  >
                    <span className="check-icon" aria-hidden="true">
                      {met ? '✔' : '○'}
                    </span>
                    {rule.label}
                  </li>
                );
              })}
            </ul>

            <button
              type="submit"
              className="btn btn-primary w-100 auth-submit"
              disabled={!canSubmit}
            >
              {submitting ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
