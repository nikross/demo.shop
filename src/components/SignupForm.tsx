import {useEffect, useState} from 'react';
import type {AuthResult} from '~/lib/auth';
import {MIN_PASSWORD_LENGTH, randomSignupEmail} from '~/lib/credentials';
import {inputClassName, noAutofillProps, primaryButtonClassName} from '~/lib/form-classes';
import {signIn} from '~/lib/session';

export function SignupForm() {
  const [result, setResult] = useState<AuthResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');

  // Pre-fill a random new address so the demo signup is one password away.
  useEffect(() => setEmail(randomSignupEmail()), []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    if (password.length < MIN_PASSWORD_LENGTH) {
      setResult({ok: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`});
      return;
    }
    setIsSubmitting(true);
    setResult(null);
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, password}),
    });
    const result = (await response.json()) as AuthResult;
    if (result.dataDome) console.log('[DataDome]', result.dataDome);
    if (result.ok) {
      signIn(email);
      window.location.assign('/profile?welcome=signup');
      return;
    }
    setResult(result);
    setIsSubmitting(false);
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Sign up</h1>
      <form className="flex max-w-none flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="signup-email" className="text-sm font-medium text-neutral-700">Email</label>
          <input id="signup-email" name="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className={inputClassName} {...noAutofillProps} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="signup-password" className="text-sm font-medium text-neutral-700">Password</label>
          <input
            id="signup-password"
            name="password"
            type="password"
            required
            minLength={MIN_PASSWORD_LENGTH}
            {...noAutofillProps}
            aria-describedby="signup-password-hint"
            className={inputClassName}
          />
          <p id="signup-password-hint" className="text-xs text-neutral-500">
            At least {MIN_PASSWORD_LENGTH} characters.
          </p>
        </div>
        <button type="submit" disabled={isSubmitting} className={`${primaryButtonClassName} w-full`}>
          {isSubmitting ? 'Signing up…' : 'Sign up'}
        </button>
      </form>
      {result && !result.ok ? (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {result.error}
        </p>
      ) : null}
      <p className="text-sm text-neutral-600">
        Already have an account? <a href="/login" className="font-medium text-neutral-900 underline">Sign in</a>
      </p>
    </div>
  );
}
