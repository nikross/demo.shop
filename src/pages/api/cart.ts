import type {APIRoute} from 'astro';
import {CART_ACTIONS} from '~/lib/cart-actions';

async function parseCartRequest(request: Request) {
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    const body = (await request.json()) as {
      cartAction?: string;
      inputs?: Record<string, unknown>;
    };
    return {
      action: String(body.cartAction ?? ''),
      inputs: body.inputs ?? {},
    };
  }

  const formData = await request.formData();
  return {
    action: String(formData.get('cartAction') ?? ''),
    inputs: JSON.parse(String(formData.get('inputs') ?? '{}')) as Record<
      string,
      unknown
    >,
  };
}

export const POST: APIRoute = async ({request, locals}) => {
  const {action, inputs} = await parseCartRequest(request);

  let result;
  switch (action) {
    case CART_ACTIONS.LinesAdd:
      result = await locals.cart.addLines(
        inputs.lines as Array<{merchandiseId: string; quantity: number}>,
      );
      break;
    case CART_ACTIONS.LinesUpdate:
      result = await locals.cart.updateLines(
        inputs.lines as Array<{id: string; quantity: number}>,
      );
      break;
    case CART_ACTIONS.LinesRemove:
      result = await locals.cart.removeLines(inputs.lineIds as string[]);
      break;
    default:
      return new Response(JSON.stringify({error: 'Unknown cart action'}), {
        status: 400,
        headers: {'Content-Type': 'application/json'},
      });
  }

  const headers: Record<string, string> = {'Content-Type': 'application/json'};
  const setCookie = result.headers.get('Set-Cookie');
  if (setCookie) headers['Set-Cookie'] = setCookie;

  return new Response(JSON.stringify({cart: result.cart}), {status: 200, headers});
};
