import type {APIRoute} from 'astro';
import {emptyCart, serializeCartCookie} from '~/lib/cart';
import {parseOrderFormData, processOrder} from '~/lib/order';

export const POST: APIRoute = async ({request}) => {
  const payload = await parseOrderFormData(request);
  const result = processOrder(payload);
  const headers = new Headers({'Content-Type': 'application/json'});
  if (!result.ok) {
    return new Response(JSON.stringify(result), {status: 400, headers});
  }
  // The order is paid, so start over with an empty cart.
  headers.append('Set-Cookie', serializeCartCookie({lines: []}));
  return new Response(JSON.stringify({...result, cart: emptyCart()}), {
    status: 200,
    headers,
  });
};
