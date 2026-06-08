import type {APIRoute} from 'astro';
import {parseOrderFormData, processOrder} from '~/lib/order';

export const POST: APIRoute = async ({request}) => {
  const payload = await parseOrderFormData(request);
  const result = processOrder(payload);
  return new Response(JSON.stringify(result), {
    status: result.ok ? 200 : 400,
    headers: {'Content-Type': 'application/json'},
  });
};
