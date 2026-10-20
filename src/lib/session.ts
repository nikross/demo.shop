/**
 * Client-side demo session: the signed-in email and every account's profile
 * live in sessionStorage. Signing out only clears the signed-in email, so
 * profile edits persist for the rest of the browser session.
 */

import {useSyncExternalStore} from 'react';
import {DEMO_USERS, type Profile} from '~/lib/credentials';

export type {Profile};

const EMAIL_KEY = 'demo-shop:signed-in-email';
const PROFILES_KEY = 'demo-shop:profiles';
const CHANGE_EVENT = 'demo-shop:session-change';

function read(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) sessionStorage.removeItem(key);
    else sessionStorage.setItem(key, value);
  } catch {
    // Storage unavailable (e.g. private mode); the demo session just won't stick.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Signs in and stores the account's profile in the session if it isn't yet. */
export function signIn(email: string) {
  const profiles = readProfiles();
  const key = email.toLowerCase();
  if (!profiles[key]) {
    profiles[key] = loadProfile(email);
    write(PROFILES_KEY, JSON.stringify(profiles));
  }
  write(EMAIL_KEY, email);
}

export function signOut() {
  write(EMAIL_KEY, null);
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

/** The signed-in email, or null when signed out (always null during SSR). */
export function useSignedInEmail(): string | null {
  return useSyncExternalStore(
    subscribe,
    () => read(EMAIL_KEY),
    () => null,
  );
}

function readProfiles(): Record<string, Profile> {
  try {
    return JSON.parse(read(PROFILES_KEY) ?? '{}') as Record<string, Profile>;
  } catch {
    return {};
  }
}

/** Guesses a name from "first.last@…" for accounts that aren't demo users. */
function profileFromEmail(email: string): Profile {
  const [first = '', last = ''] = email
    .split('@')[0]
    .split(/[._-]/)
    .map((part) => part.replace(/\d+/g, ''))
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1));
  return {
    email,
    firstName: first,
    lastName: last,
    phone: '',
    address: '',
    city: '',
    zip: '',
    country: '',
  };
}

/** The session's copy of the profile, seeded from the demo users on first use. */
export function loadProfile(email: string): Profile {
  const key = email.toLowerCase();
  return (
    readProfiles()[key] ??
    DEMO_USERS.find((user) => user.email === key) ??
    profileFromEmail(email)
  );
}

/** Saves the profile (moving it if the email changed) and keeps the user signed in. */
export function saveProfile(previousEmail: string, profile: Profile) {
  const profiles = readProfiles();
  delete profiles[previousEmail.toLowerCase()];
  profiles[profile.email.toLowerCase()] = profile;
  write(PROFILES_KEY, JSON.stringify(profiles));
  write(EMAIL_KEY, profile.email);
}
