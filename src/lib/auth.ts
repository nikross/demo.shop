/**
 * Mock auth for demo login/signup flows.
 * Does not persist users or issue real sessions beyond a simple cookie.
 */

export const MOCK_EMAIL = 'jon@gmail.com';
export const MOCK_PASSWORD = '12345';

export type AuthResult =
  | {ok: true; message: string}
  | {ok: false; error: string};

export async function parseAuthFormData(request: Request) {
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    const body = (await request.json()) as {email?: string; password?: string};
    return {
      email: String(body.email ?? '').trim(),
      password: String(body.password ?? ''),
    };
  }

  const formData = await request.formData();
  return {
    email: String(formData.get('email') ?? '').trim(),
    password: String(formData.get('password') ?? ''),
  };
}

export function authenticateLogin(email: string, password: string): AuthResult {
  if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
    return {ok: true, message: 'Login successful. Welcome back!'};
  }
  return {ok: false, error: 'Invalid login'};
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSignup(email: string, password: string): AuthResult {
  if (!EMAIL_PATTERN.test(email)) {
    return {ok: false, error: 'Please enter a valid email address.'};
  }
  if (!password.trim()) {
    return {ok: false, error: 'Password is required.'};
  }
  return {
    ok: true,
    message: 'Sign up successful! (Demo only — no account was created.)',
  };
}
