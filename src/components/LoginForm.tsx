import {useState} from 'react';
import {ProcessedOrder} from '~/components/ProcessedOrder';
import {MOCK_EMAIL, MOCK_PASSWORD, type AuthResult} from '~/lib/auth';
import {inputClassName, primaryButtonClassName} from '~/lib/form-classes';

export function LoginForm() {
  const [result, setResult] = useState<AuthResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setResult(null);
    const form = event.currentTarget;
    const response = await fetch('/api/auth/login', {method: 'POST', body: new FormData(form)});
    setResult((await response.json()) as AuthResult);
    setIsSubmitting(false);
  }

  if (result?.ok) {
    return (
      <div className="mx-auto w-full max-w-md">
        <ProcessedOrder subtitle={result.message} />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Sign in</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-email" className="text-sm font-medium text-neutral-700">Email</label>
          <input id="login-email" name="email" type="email" required defaultValue={MOCK_EMAIL} className={inputClassName} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-password" className="text-sm font-medium text-neutral-700">Password</label>
          <input id="login-password" name="password" type="password" required defaultValue={MOCK_PASSWORD} className={inputClassName} />
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
