import type {Route} from './+types/api.order';
import {parseOrderFormData, processOrder} from '~/lib/order-middleware';

export async function action({request}: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return Response.json(
      {ok: false, error: 'Method not allowed'},
      {status: 405},
    );
  }

  const payload = await parseOrderFormData(request);
  const result = processOrder(payload);
  return Response.json(result, {status: result.ok ? 200 : 400});
}
