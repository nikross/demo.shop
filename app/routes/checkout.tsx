import {useState} from 'react';
import {useLoaderData} from 'react-router';
import type {Route} from './+types/checkout';
import {CheckoutCartItems} from '~/components/CheckoutCartItems';
import {ProcessedOrder} from '~/components/ProcessedOrder';
import type {OrderResult} from '~/lib/order-middleware';
import {
  inputClassName,
  primaryButtonClassName,
  textareaClassName,
} from '~/lib/form-classes';
import {MOCK_CHECKOUT} from '~/lib/mock-data';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Shop | Checkout'}];
};

export async function loader({context}: Route.LoaderArgs) {
  const {cart} = context;
  return await cart.get();
}

export default function Checkout() {
  const cart = useLoaderData<typeof loader>();
  const [result, setResult] = useState<OrderResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    const form = event.currentTarget;
    const response = await fetch('/api/order', {
      method: 'POST',
      body: new FormData(form),
    });

    const data = (await response.json()) as OrderResult;
    setResult(data);
    setIsSubmitting(false);
  }

  if (result?.ok) {
    return (
      <div className="mx-auto w-full max-w-lg">
        <ProcessedOrder
          orderId={result.orderId}
          subtitle={result.message}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
        Checkout
      </h1>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-neutral-900">
            Your cart
          </h2>
          <CheckoutCartItems cart={cart} />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-neutral-900">
            Order details
          </h2>

          {result && !result.ok ? (
            <p
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {result.error}
            </p>
          ) : null}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="checkout-email" className="text-sm font-medium text-neutral-700">
                Email
              </label>
              <input
                id="checkout-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                defaultValue={MOCK_CHECKOUT.email}
                className={inputClassName}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="checkout-name" className="text-sm font-medium text-neutral-700">
                Name
              </label>
              <input
                id="checkout-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                defaultValue={MOCK_CHECKOUT.name}
                className={inputClassName}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="checkout-address"
                className="text-sm font-medium text-neutral-700"
              >
                Delivery address
              </label>
              <textarea
                id="checkout-address"
                name="deliveryAddress"
                autoComplete="street-address"
                required
                rows={3}
                defaultValue={MOCK_CHECKOUT.deliveryAddress}
                className={textareaClassName}
              />
            </div>

            <fieldset className="flex flex-col gap-4 rounded-lg border border-neutral-200 p-4">
              <legend className="px-1 text-sm font-semibold text-neutral-900">
                Payment
              </legend>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="checkout-card"
                  className="text-sm font-medium text-neutral-700"
                >
                  Card number
                </label>
                <input
                  id="checkout-card"
                  name="cardNumber"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  required
                  defaultValue={MOCK_CHECKOUT.cardNumber}
                  className={inputClassName}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="checkout-expiry"
                    className="text-sm font-medium text-neutral-700"
                  >
                    Expiry
                  </label>
                  <input
                    id="checkout-expiry"
                    name="cardExpiry"
                    type="text"
                    autoComplete="cc-exp"
                    required
                    defaultValue={MOCK_CHECKOUT.cardExpiry}
                    className={inputClassName}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="checkout-cvc"
                    className="text-sm font-medium text-neutral-700"
                  >
                    CVC
                  </label>
                  <input
                    id="checkout-cvc"
                    name="cardCvc"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    required
                    defaultValue={MOCK_CHECKOUT.cardCvc}
                    className={inputClassName}
                  />
                </div>
              </div>
            </fieldset>

            <button
              type="submit"
              disabled={isSubmitting || !cart?.lines?.nodes?.length}
              className={`${primaryButtonClassName} w-full`}
            >
              {isSubmitting ? 'Processing…' : 'Pay now'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
