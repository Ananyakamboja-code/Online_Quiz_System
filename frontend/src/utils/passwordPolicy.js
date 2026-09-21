/**
 * Password policy shared by the register form. Must stay in sync with the
 * backend's validatePassword() — the backend is the real gate; this drives the
 * live checklist UX.
 *
 * Rules: min 8 chars + at least one lowercase, uppercase, number, and symbol.
 */
export const PASSWORD_RULES = [
  { key: 'length', label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { key: 'lower', label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
  { key: 'upper', label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { key: 'number', label: 'One number', test: (p) => /[0-9]/.test(p) },
  { key: 'symbol', label: 'One symbol', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

/** Returns an object of { ruleKey: boolean } for the given password. */
export function checkPassword(password = '') {
  return PASSWORD_RULES.reduce((acc, rule) => {
    acc[rule.key] = rule.test(password);
    return acc;
  }, {});
}

/** True only when every rule passes. */
export function isPasswordValid(password = '') {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}
