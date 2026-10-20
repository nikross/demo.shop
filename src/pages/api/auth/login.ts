import type {APIRoute} from 'astro';
import {getClientIp, withJsonErrors} from '~/lib/request';
import {authenticateLogin, parseAuthFormData, validateLogin} from '~/lib/auth';

export const POST: APIRoute = withJsonErrors(async (context) => {
  const {request} = context;
  const clientAddress = getClientIp(context);
  const {email, password} = await parseAuthFormData(request);
  const auth = authenticateLogin(email, password);
  const dataDome = await validateLogin(request, clientAddress, email, auth.ok);
  // A failed login gets no DataDome decision, only a note that it was collected.
  const result = !dataDome.ok
    ? dataDome
    : auth.ok
      ? {...auth, dataDome: dataDome.dataDome}
      : {
          ...auth,
          error: `${auth.error}. ${dataDome.message}`,
          dataDome: dataDome.dataDome,
        };
  return new Response(JSON.stringify(result), {
    status: result.ok ? 200 : 401,
    headers: {'Content-Type': 'application/json'},
  });
});
