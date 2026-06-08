import type {APIRoute} from 'astro';
import {authenticateLogin, parseAuthFormData} from '~/lib/auth';
import {authSuccessCookie} from '~/lib/cart';

export const POST: APIRoute = async ({request}) => {
  const {email, password} = await parseAuthFormData(request);
  const result = authenticateLogin(email, password);
  const headers: Record<string, string> = {'Content-Type': 'application/json'};
  if (result.ok) headers['Set-Cookie'] = authSuccessCookie();
  return new Response(JSON.stringify(result), {
    status: result.ok ? 200 : 401,
    headers,
  });
};
