import {useState} from 'react';
import {ProcessedOrder} from '~/components/ProcessedOrder';
import {dispatchCartUpdated} from '~/components/CartForm';
import type {Cart} from '~/lib/types';
import type {OrderResult} from '~/lib/order';
import {MOCK_PAYMENT} from '~/lib/mock-data';
import {inputClassName, noAutofillProps, primaryButtonClassName, textareaClassName} from '~/lib/form-classes';
import {EurMoney} from '~/components/EurMoney';
import {loadProfile, useSignedInEmail} from '~/lib/session';

export function CheckoutForm({cart}: {cart: Cart | null}) {
  const [result, setResult] = useState<OrderResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const lines = cart?.lines?.nodes ?? [];
  const contact = useCheckoutContact();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setResult(null);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const response = await fetch('/api/order', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: String(formData.get('email') ?? ''),
        name: String(formData.get('name') ?? ''),
        deliveryAddress: String(formData.get('deliveryAddress') ?? ''),
        cardNumber: String(formData.get('cardNumber') ?? ''),
        cardExpiry: String(formData.get('cardExpiry') ?? ''),
        cardCvc: String(formData.get('cardCvc') ?? ''),
      }),
    });
    const result = (await response.json()) as OrderResult;
    if (result.ok && result.cart) dispatchCartUpdated(result.cart);
    setResult(result);
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
            <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-neutral-50">
              {lines.map((line) => (
                <li key={line.id} className="mb-0 flex items-center gap-4 p-4">
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
          {/* Keyed so the default values refresh once the session profile is read. */}
          <form key={JSON.stringify(contact)} className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input name="email" type="email" required defaultValue={contact.email} className={inputClassName} placeholder="Email" {...noAutofillProps} />
            <input name="name" type="text" required defaultValue={contact.name} className={inputClassName} placeholder="Name" />
            <textarea name="deliveryAddress" required rows={3} defaultValue={contact.deliveryAddress} className={textareaClassName} placeholder="Address" />
            <input name="cardNumber" required defaultValue={MOCK_PAYMENT.cardNumber} className={inputClassName} placeholder="Card number" />
            <div className="grid grid-cols-2 gap-4">
              <input name="cardExpiry" required defaultValue={MOCK_PAYMENT.cardExpiry} className={inputClassName} placeholder="Expiry" />
              <input name="cardCvc" required defaultValue={MOCK_PAYMENT.cardCvc} className={inputClassName} placeholder="CVC" />
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

/** Contact details from the signed-in user's profile; empty for guests. */
function useCheckoutContact() {
  const signedInEmail = useSignedInEmail();
  if (!signedInEmail) return {email: '', name: '', deliveryAddress: ''};
  const profile = loadProfile(signedInEmail);
  return {
    email: profile.email,
    name: [profile.firstName, profile.lastName].filter(Boolean).join(' '),
    deliveryAddress: [
      profile.address,
      [profile.zip, profile.city].filter(Boolean).join(' '),
      profile.country,
    ]
      .filter(Boolean)
      .join('\n'),
  };
}
