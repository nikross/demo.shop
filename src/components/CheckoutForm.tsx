import {useState} from 'react';
import {ProcessedOrder} from '~/components/ProcessedOrder';
import type {Cart} from '~/lib/types';
import type {OrderResult} from '~/lib/order';
import {MOCK_CHECKOUT} from '~/lib/mock-data';
import {inputClassName, primaryButtonClassName, textareaClassName} from '~/lib/form-classes';
import {EurMoney} from '~/components/EurMoney';

export function CheckoutForm({cart}: {cart: Cart | null}) {
  const [result, setResult] = useState<OrderResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const lines = cart?.lines?.nodes ?? [];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setResult(null);
    const form = event.currentTarget;
    const response = await fetch('/api/order', {method: 'POST', body: new FormData(form)});
    setResult((await response.json()) as OrderResult);
    setIsSubmitting(false);
  }

  if (result?.ok) {
    return (
      <div className="mx-auto w-full max-w-lg">
        <ProcessedOrder orderId={result.orderId} subtitle={result.message} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Checkout</h1>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-neutral-900">Your cart</h2>
          {!lines.length ? (
            <p className="text-sm text-neutral-600">
              Your cart is empty. <a href="/collections" className="underline">Browse products</a>
            </p>
          ) : (
            <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
              {lines.map((line) => (
                <li key={line.id} className="flex gap-4 p-4">
                  {line.merchandise.image && (
                    <img src={line.merchandise.image.url} alt="" className="size-16 rounded-md object-cover" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{line.merchandise.product.title}</p>
                    <p className="text-sm text-neutral-600">Qty: {line.quantity}</p>
                  </div>
                  <EurMoney amount={line.cost.totalAmount.amount} />
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-neutral-900">Order details</h2>
          {result && !result.ok ? (
            <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {result.error}
            </p>
          ) : null}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input name="email" type="email" required defaultValue={MOCK_CHECKOUT.email} className={inputClassName} placeholder="Email" />
            <input name="name" type="text" required defaultValue={MOCK_CHECKOUT.name} className={inputClassName} placeholder="Name" />
            <textarea name="deliveryAddress" required rows={3} defaultValue={MOCK_CHECKOUT.deliveryAddress} className={textareaClassName} placeholder="Address" />
            <input name="cardNumber" required defaultValue={MOCK_CHECKOUT.cardNumber} className={inputClassName} placeholder="Card number" />
            <div className="grid grid-cols-2 gap-4">
              <input name="cardExpiry" required defaultValue={MOCK_CHECKOUT.cardExpiry} className={inputClassName} placeholder="Expiry" />
              <input name="cardCvc" required defaultValue={MOCK_CHECKOUT.cardCvc} className={inputClassName} placeholder="CVC" />
            </div>
            <button type="submit" disabled={isSubmitting || !lines.length} className={`${primaryButtonClassName} w-full`}>
              {isSubmitting ? 'Processing…' : 'Pay now'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
