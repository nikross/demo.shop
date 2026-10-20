import type {APIRoute} from 'astro';
import {getClientIp, withJsonErrors} from '~/lib/request';
import {parseAuthFormData, validateSignup} from '~/lib/auth';

export const POST: APIRoute = withJsonErrors(async (context) => {
  const {request} = context;
  const clientAddress = getClientIp(context);
  const {email, password} = await parseAuthFormData(request);
  const result = await validateSignup(request, clientAddress, email, password);
  return new Response(JSON.stringify(result), {
    status: result.ok ? 200 : 400,
    headers: {'Content-Type': 'application/json'},
  });
});
