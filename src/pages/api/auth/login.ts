import type {APIRoute} from 'astro';
import {authenticateLogin, parseAuthFormData, validateLogin} from '~/lib/auth';
import {authSuccessCookie} from '~/lib/cart';

export const POST: APIRoute = async ({request, clientAddress}) => {
  const {email, password} = await parseAuthFormData(request);
  const auth = authenticateLogin(email, password);
  const dataDome = await validateLogin(request, clientAddress, email, auth.ok);
  const result = dataDome.ok
    ? {...auth, dataDome: dataDome.dataDome}
    : dataDome;
  const headers: Record<string, string> = {'Content-Type': 'application/json'};
  if (result.ok) headers['Set-Cookie'] = authSuccessCookie();
  return new Response(JSON.stringify(result), {
    status: result.ok ? 200 : 401,
    headers,
  });
};
