import {useEffect, useState} from 'react';
import {inputClassName, primaryButtonClassName} from '~/lib/form-classes';
import {loadProfile, saveProfile, signOut, useSignedInEmail, type Profile} from '~/lib/session';

const FIELDS: {name: keyof Profile; label: string; type?: string; autoComplete: string}[] = [
  {name: 'email', label: 'Email', type: 'email', autoComplete: 'email'},
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
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (signedInEmail && !profile) setProfile(loadProfile(signedInEmail));
  }, [signedInEmail, profile]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile) return;
    saveProfile(signedInEmail ?? profile.email, {...profile, email: profile.email.trim()});
    setSaved(true);
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
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {FIELDS.map((field) => (
          <div key={field.name} className="flex flex-col gap-1.5">
            <label htmlFor={`profile-${field.name}`} className="text-sm font-medium text-neutral-700">
              {field.label}
            </label>
            <input
              id={`profile-${field.name}`}
              name={field.name}
              type={field.type ?? 'text'}
              autoComplete={field.autoComplete}
              required={field.name === 'email'}
              value={profile[field.name]}
              onChange={(event) => {
                setSaved(false);
                setProfile({...profile, [field.name]: event.target.value});
              }}
              className={inputClassName}
            />
          </div>
        ))}
        <button type="submit" className={`${primaryButtonClassName} w-full`}>
          Save profile
        </button>
      </form>
      {saved ? (
        <p role="status" className="text-sm text-green-700">
          Profile saved.
        </p>
      ) : null}
      <a href="/login" onClick={signOut} className="text-sm font-medium text-neutral-900 underline">
        Sign out
      </a>
    </div>
  );
}
