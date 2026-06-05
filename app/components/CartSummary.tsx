import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {type OptimisticCart} from '@shopify/hydrogen';
import {EurMoney} from '~/components/EurMoney';
import {Link} from 'react-router';
import {useId} from 'react';
import {useAside} from '~/components/Aside';
import {checkoutButtonClassName} from '~/lib/form-classes';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const className =
    layout === 'page'
      ? 'relative mt-8 rounded-lg border border-neutral-200 bg-neutral-50 p-6'
      : 'absolute bottom-0 w-[calc(var(--aside-width)-40px)] border-t border-neutral-200 bg-white pt-4 pb-6';
  const summaryId = useId();

  return (
    <div aria-labelledby={summaryId} className={className}>
      <h4 id={summaryId} className="mb-4 text-lg font-semibold text-neutral-900">
        Totals
      </h4>
      <dl
        role="group"
        className="flex items-center justify-between gap-4 border-b border-neutral-200 py-3 font-medium"
      >
        <dt>Subtotal</dt>
        <dd>
          {cart?.cost?.subtotalAmount?.amount ? (
            <EurMoney
              data={{
                amount: cart.cost.subtotalAmount.amount!,
                currencyCode: cart.cost.subtotalAmount.currencyCode ?? 'EUR',
              }}
            />
          ) : (
            '-'
          )}
        </dd>
      </dl>
      <CartCheckoutActions cart={cart} layout={layout} />
    </div>
  );
}

function CartCheckoutActions({
  cart,
  layout,
}: {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
}) {
  const {close} = useAside();
  const cartHasItems = Boolean(cart?.totalQuantity && cart.totalQuantity > 0);

  if (!cartHasItems) return null;

  return (
    <div className="mt-4">
      <Link
        to="/checkout"
        className={checkoutButtonClassName}
        onClick={() => {
          if (layout === 'aside') {
            close();
          }
        }}
      >
        Checkout
      </Link>
    </div>
  );
}
