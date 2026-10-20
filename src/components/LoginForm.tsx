import {useEffect, useState} from 'react';
import type {AuthResult} from '~/lib/auth';
import {MIN_PASSWORD_LENGTH, randomLeakedCredentials} from '~/lib/credentials';
import {inputClassName, primaryButtonClassName} from '~/lib/form-classes';
import {signIn} from '~/lib/session';

export function LoginForm() {
  const [result, setResult] = useState<AuthResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Simulate credential stuffing: every page load replays a random leaked combo.
  useEffect(() => {
    const credentials = randomLeakedCredentials();
    setEmail(credentials.email);
    setPassword(credentials.password);
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setResult(null);
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, password}),
    });
    const result = (await response.json()) as AuthResult;
    if (result.dataDome) console.log('[DataDome]', result.dataDome);
    if (result.ok) {
      signIn(email.trim());
      window.location.assign('/profile?welcome=login');
      return;
    }
    setResult(result);
    setIsSubmitting(false);
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Sign in</h1>
        <details className="group rounded-md border border-yellow-300 bg-yellow-50 text-xs text-yellow-900">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 font-semibold [&::-webkit-details-marker]:hidden">
            Credential stuffing demo: how this works
            <span aria-hidden="true" className="transition group-open:rotate-180">▾</span>
          </summary>
          <div className="flex flex-col gap-2 border-t border-yellow-200 px-3 py-2">
            <p className="text-xs">
              On every page load this form is pre-filled with a random email and a short password from a fake leaked
              combo list, just like a bot replaying stolen credentials.
            </p>
            <p className="text-xs">
              Any email is accepted, but the password must be at least {MIN_PASSWORD_LENGTH} characters long. The
              pre-filled password never is, so submitting as-is fails and the attempt is reported to DataDome. Reload
              to try another combo, or enter a password with {MIN_PASSWORD_LENGTH}+ characters to sign in.
            </p>
          </div>
        </details>
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-email" className="text-sm font-medium text-neutral-700">Email</label>
          <input id="login-email" name="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className={inputClassName} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-password" className="text-sm font-medium text-neutral-700">Password</label>
          <input id="login-password" name="password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className={inputClassName} />
        </div>
        <button type="submit" disabled={isSubmitting} className={`${primaryButtonClassName} w-full`}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      {result && !result.ok ? (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {result.error}
        </p>
      ) : null}
      <p className="text-sm text-neutral-600">
        Don&apos;t have an account? <a href="/signup" className="font-medium text-neutral-900 underline">Sign up</a>
      </p>
    </div>
  );
}
