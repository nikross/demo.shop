import {useEffect, useState} from 'react';
import type {AuthResult} from '~/lib/auth';
import {inputClassName, noAutofillProps, primaryButtonClassName} from '~/lib/form-classes';
import {loadProfile, saveProfile, signOut, useSignedInEmail, type Profile} from '~/lib/session';

const FIELDS: {name: keyof Profile; label: string; type?: string; autoComplete: string}[] = [
  {name: 'email', label: 'Email', type: 'email', autoComplete: 'off'},
  {name: 'firstName', label: 'First name', autoComplete: 'given-name'},
  {name: 'lastName', label: 'Last name', autoComplete: 'family-name'},
  {name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel'},
  {name: 'address', label: 'Address', autoComplete: 'street-address'},
  {name: 'city', label: 'City', autoComplete: 'address-level2'},
  {name: 'zip', label: 'ZIP code', autoComplete: 'postal-code'},
  {name: 'country', label: 'Country', autoComplete: 'country-name'},
];

export function ProfileForm({welcome}: {welcome: string | null}) {
  const signedInEmail = useSignedInEmail();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [result, setResult] = useState<AuthResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (signedInEmail && !profile) setProfile(loadProfile(signedInEmail));
  }, [signedInEmail, profile]);

  // DataDome validates the account update first; only allowed changes are saved.
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile || !signedInEmail) return;
    setIsSubmitting(true);
    setResult(null);
    const updated = {...profile, email: profile.email.trim()};
    const response = await fetch('/api/profile', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({accountEmail: signedInEmail, profile: updated}),
    });
    const result = (await response.json()) as AuthResult;
    if (result.dataDome) console.log('[DataDome]', result.dataDome);
    if (result.ok) saveProfile(signedInEmail, updated);
    setResult(result);
    setIsSubmitting(false);
  }

  if (!signedInEmail || !profile) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Profile</h1>
        <p className="text-sm text-neutral-600">
          You&apos;re not signed in. <a href="/login" className="font-medium text-neutral-900 underline">Sign in</a> or{' '}
          <a href="/signup" className="font-medium text-neutral-900 underline">create an account</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8">
      {welcome === 'signup' ? (
        <div role="status" className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          <strong>Sign up successful!</strong> Welcome, {profile.firstName || signedInEmail}. Complete your profile
          below. (Demo only — the profile is kept in this browser tab&apos;s session storage.)
        </div>
      ) : welcome === 'login' ? (
        <div role="status" className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          <strong>Login successful!</strong> Welcome back, {profile.firstName || signedInEmail}.
        </div>
      ) : null}
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Profile</h1>
      <form className="flex max-w-none flex-col gap-4" onSubmit={handleSubmit}>
        {FIELDS.map((field) => (
          <div key={field.name} className="flex flex-col gap-1.5">
            <label htmlFor={`profile-${field.name}`} className="text-sm font-medium text-neutral-700">
              {field.label}
            </label>
            <input
              id={`profile-${field.name}`}
              name={field.name}
              type={field.type ?? 'text'}
              {...(field.type === 'email' ? noAutofillProps : {})}
              autoComplete={field.autoComplete}
              required={field.name === 'email'}
              value={profile[field.name]}
              onChange={(event) => {
                setResult(null);
                setProfile({...profile, [field.name]: event.target.value});
              }}
              className={inputClassName}
            />
          </div>
        ))}
        <button type="submit" disabled={isSubmitting} className={`${primaryButtonClassName} w-full`}>
          {isSubmitting ? 'Saving…' : 'Save profile'}
        </button>
      </form>
      {result?.ok ? (
        <p role="status" className="text-sm text-green-700">
          {result.message}
        </p>
      ) : result ? (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {result.error}
        </p>
      ) : null}
      <a href="/login" onClick={signOut} className="text-sm font-medium text-neutral-900 underline">
        Sign out
      </a>
    </div>
  );
}
