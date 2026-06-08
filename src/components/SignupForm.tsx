import {useState} from 'react';
import {ProcessedOrder} from '~/components/ProcessedOrder';
import type {AuthResult} from '~/lib/auth';
import {inputClassName, primaryButtonClassName} from '~/lib/form-classes';

export function SignupForm() {
  const [result, setResult] = useState<AuthResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setResult(null);
    const form = event.currentTarget;
    const response = await fetch('/api/auth/signup', {method: 'POST', body: new FormData(form)});
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
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Sign up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="signup-email" className="text-sm font-medium text-neutral-700">Email</label>
          <input id="signup-email" name="email" type="email" required className={inputClassName} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="signup-password" className="text-sm font-medium text-neutral-700">Password</label>
          <input id="signup-password" name="password" type="password" required className={inputClassName} />
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
