import type {APIRoute} from 'astro';
import {authenticateLogin, parseAuthFormData, validateLogin} from '~/lib/auth';

export const POST: APIRoute = async ({request, clientAddress}) => {
  const {email, password} = await parseAuthFormData(request);
  const auth = authenticateLogin(email, password);
  const dataDome = await validateLogin(request, clientAddress, email, auth.ok);
  const result = dataDome.ok
    ? {...auth, dataDome: dataDome.dataDome}
    : dataDome;
  return new Response(JSON.stringify(result), {
    status: result.ok ? 200 : 401,
    headers: {'Content-Type': 'application/json'},
  });
};
