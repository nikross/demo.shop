import type {APIRoute} from 'astro';
import {parseAuthFormData, validateSignup} from '~/lib/auth';

export const POST: APIRoute = async ({request}) => {
  const {email, password} = await parseAuthFormData(request);
  const result = validateSignup(email, password);
  return new Response(JSON.stringify(result), {
    status: result.ok ? 200 : 400,
    headers: {'Content-Type': 'application/json'},
  });
};
