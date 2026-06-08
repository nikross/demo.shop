/**
 * Mock order processing for demo checkout.
 */

export type OrderPayload = {
  email: string;
  name: string;
  deliveryAddress: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
};

export type OrderResult =
  | {ok: true; message: string; orderId: string}
  | {ok: false; error: string};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function parseOrderFormData(
  request: Request,
): Promise<OrderPayload> {
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    const body = (await request.json()) as Partial<OrderPayload>;
    return {
      email: String(body.email ?? '').trim(),
      name: String(body.name ?? '').trim(),
      deliveryAddress: String(body.deliveryAddress ?? '').trim(),
      cardNumber: String(body.cardNumber ?? '').replace(/\s/g, ''),
      cardExpiry: String(body.cardExpiry ?? '').trim(),
      cardCvc: String(body.cardCvc ?? '').trim(),
    };
  }

  const formData = await request.formData();
  return {
    email: String(formData.get('email') ?? '').trim(),
    name: String(formData.get('name') ?? '').trim(),
    deliveryAddress: String(formData.get('deliveryAddress') ?? '').trim(),
    cardNumber: String(formData.get('cardNumber') ?? '').replace(/\s/g, ''),
    cardExpiry: String(formData.get('cardExpiry') ?? '').trim(),
    cardCvc: String(formData.get('cardCvc') ?? '').trim(),
  };
}

export function processOrder(payload: OrderPayload): OrderResult {
  if (!EMAIL_PATTERN.test(payload.email)) {
    return {ok: false, error: 'Please enter a valid email address.'};
  }
  if (!payload.name) {
    return {ok: false, error: 'Name is required.'};
  }
  if (!payload.deliveryAddress) {
    return {ok: false, error: 'Delivery address is required.'};
  }
  if (payload.cardNumber.length < 13) {
    return {ok: false, error: 'Please enter a valid card number.'};
  }
  if (!payload.cardExpiry) {
    return {ok: false, error: 'Card expiry is required.'};
  }
  if (payload.cardCvc.length < 3) {
    return {ok: false, error: 'Please enter a valid CVC.'};
  }

  const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;

  return {
    ok: true,
    message: 'Payment received. Your order has been processed.',
    orderId,
  };
}
