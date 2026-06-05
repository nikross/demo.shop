import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {EurMoney} from '~/components/EurMoney';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

export function CheckoutCartItems({cart}: {cart: CartApiQueryFragment | null}) {
  const lines = cart?.lines?.nodes ?? [];

  if (!lines.length) {
    return (
      <p className="text-sm text-neutral-600">
        Your cart is empty.{' '}
        <Link to="/collections" className="font-medium text-neutral-900 underline">
          Browse products
        </Link>
      </p>
    );
  }

  return (
    <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
      {lines.map((line) => {
        const {merchandise, quantity, cost} = line;
        const {product, title, image, selectedOptions} = merchandise;

        return (
          <li key={line.id} className="flex gap-4 p-4">
            {image ? (
              <div className="size-16 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                <Image
                  alt={title}
                  aspectRatio="1/1"
                  className="h-full w-full object-cover"
                  data={image}
                  height={64}
                  width={64}
                />
              </div>
            ) : null}
            <div className="min-w-0 flex-1">
              <p className="font-medium text-neutral-900">{product.title}</p>
              {selectedOptions.length > 0 ? (
                <ul className="mt-1 text-xs text-neutral-500">
                  {selectedOptions.map((option) => (
                    <li key={option.name}>
                      {option.name}: {option.value}
                    </li>
                  ))}
                </ul>
              ) : null}
              <p className="mt-1 text-sm text-neutral-600">Qty: {quantity}</p>
            </div>
            <div className="shrink-0 text-sm font-medium text-neutral-900">
              {cost?.totalAmount ? <EurMoney data={cost.totalAmount} /> : null}
            </div>
          </li>
        );
      })}
      {cart?.cost?.subtotalAmount ? (
        <li className="flex justify-between bg-neutral-50 px-4 py-3 text-sm font-semibold">
          <span>Subtotal</span>
          <EurMoney data={cart.cost.subtotalAmount} />
        </li>
      ) : null}
    </ul>
  );
}
