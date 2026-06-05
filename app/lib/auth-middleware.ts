/**
 * Mock auth middleware for demo login/signup flows.
 * Does not persist users or issue real sessions.
 */

export const MOCK_EMAIL = 'jon@gmail.com';
export const MOCK_PASSWORD = '12345';

export type AuthResult =
  | {ok: true; message: string}
  | {ok: false; error: string};

export async function parseAuthFormData(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  return {email, password};
}

/** Validates mock login credentials. */
export function authenticateLogin(email: string, password: string): AuthResult {
  if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
    return {ok: true, message: 'Login successful. Welcome back!'}
  }
  return {ok: false, error: 'Invalid login'};
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: string) {
  return EMAIL_PATTERN.test(email);
}

/** Validates signup input without creating a user. */
export function validateSignup(email: string, password: string): AuthResult {
  if (!isValidEmail(email)) {
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

/** Handles POST /api/auth/* requests at the edge before React Router. */
export async function handleAuthApiRequest(
  request: Request,
): Promise<Response | null> {
  const url = new URL(request.url);

  if (request.method !== 'POST') {
    return null;
  }

  if (url.pathname === '/api/auth/login') {
    const {email, password} = await parseAuthFormData(request);
    const result = authenticateLogin(email, password);
    return Response.json(result, {status: result.ok ? 200 : 401});
  }

  if (url.pathname === '/api/auth/signup') {
    const {email, password} = await parseAuthFormData(request);
    const result = validateSignup(email, password);
    return Response.json(result, {status: result.ok ? 200 : 400});
  }

  return null;
}
