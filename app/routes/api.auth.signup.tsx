import type {Route} from './+types/api.auth.signup';
import {parseAuthFormData, validateSignup} from '~/lib/auth-middleware';

export async function action({request}: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return Response.json(
      {ok: false, error: 'Method not allowed'},
      {status: 405},
    );
  }

  const {email, password} = await parseAuthFormData(request);
  const result = validateSignup(email, password);
  return Response.json(result, {status: result.ok ? 200 : 400});
}
