import type {APIRoute} from 'astro';
import {validateProfileUpdate} from '~/lib/auth';
import type {Profile} from '~/lib/credentials';

const PROFILE_FIELDS = [
  'email',
  'firstName',
  'lastName',
  'phone',
  'address',
  'city',
  'zip',
  'country',
] as const satisfies ReadonlyArray<keyof Profile>;

export const POST: APIRoute = async ({request, clientAddress}) => {
  const body = (await request.json()) as {
    accountEmail?: string;
    profile?: Partial<Profile>;
  };
  const profile = Object.fromEntries(
    PROFILE_FIELDS.map((field) => [
      field,
      String(body.profile?.[field] ?? '').trim(),
    ]),
  ) as Profile;
  const accountEmail = String(body.accountEmail ?? profile.email).trim();

  const result = await validateProfileUpdate(
    request,
    clientAddress,
    accountEmail,
    profile,
  );
  return new Response(JSON.stringify(result), {
    // 403 for a DataDome block, 400 for invalid input.
    status: result.ok ? 200 : result.dataDome ? 403 : 400,
    headers: {'Content-Type': 'application/json'},
  });
};
