import type {Cart} from '~/lib/types';
import {EurMoney} from '~/components/EurMoney';
import {useAside} from '~/components/Aside';
import {checkoutButtonClassName} from '~/lib/form-classes';

export function CartSummary({
  cart,
  layout,
}: {
  cart: Cart | null;
  layout: 'page' | 'aside';
}) {
  const {close} = useAside();
  const className =
    layout === 'page'
      ? 'relative mt-8 rounded-lg border border-neutral-200 bg-neutral-50 p-6'
      : 'absolute bottom-0 w-[calc(var(--aside-width)-40px)] border-t border-neutral-200 bg-white pt-4 pb-6';

  if (!cart?.totalQuantity) return null;

  return (
    <div className={className}>
      <h4 className="mb-4 text-lg font-semibold text-neutral-900">Totals</h4>
      <dl className="flex items-center justify-between gap-4 border-b border-neutral-200 py-3 font-medium">
        <dt>Subtotal</dt>
        <dd>
          {cart.cost.subtotalAmount?.amount ? (
            <EurMoney amount={cart.cost.subtotalAmount.amount} />
          ) : (
            '-'
          )}
        </dd>
      </dl>
      <div className="mt-4">
        <a
          href="/checkout"
          className={checkoutButtonClassName}
          onClick={() => layout === 'aside' && close()}
        >
          Checkout
        </a>
      </div>
    </div>
  );
}
