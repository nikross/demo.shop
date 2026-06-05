import type {Route} from './+types/api.auth.login';
import {authenticateLogin, parseAuthFormData} from '~/lib/auth-middleware';

export async function action({request}: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return Response.json(
      {ok: false, error: 'Method not allowed'},
      {status: 405},
    );
  }

  const {email, password} = await parseAuthFormData(request);
  const result = authenticateLogin(email, password);
  return Response.json(result, {status: result.ok ? 200 : 401});
}
