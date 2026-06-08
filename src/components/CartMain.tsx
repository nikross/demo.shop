import type {Cart} from '~/lib/types';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from '~/components/CartSummary';
import {useAside} from '~/components/Aside';

export function CartMain({
  cart,
  layout,
}: {
  cart: Cart | null;
  layout: 'page' | 'aside';
}) {
  const {close} = useAside();
  const linesCount = Boolean(cart?.lines?.nodes?.length);
  const cartHasItems = Boolean(cart?.totalQuantity);

  return (
    <section
      className="h-full w-auto max-h-[calc(100vh-var(--cart-aside-summary-height))] overflow-y-auto"
      aria-label={layout === 'page' ? 'Cart page' : 'Cart drawer'}
    >
      {!linesCount && (
        <div className="flex flex-col gap-4 py-4 text-center">
          <p className="text-neutral-600">
            Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you started!
          </p>
          <a
            href="/collections"
            onClick={close}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md bg-neutral-900 px-6 text-sm font-medium text-white no-underline transition hover:bg-neutral-800"
          >
            Continue shopping →
          </a>
        </div>
      )}
      <div className="flex flex-col gap-6">
        <ul className="divide-y divide-neutral-200">
          {(cart?.lines?.nodes ?? []).map((line) => (
            <CartLineItem key={line.id} line={line} layout={layout} />
          ))}
        </ul>
        {cartHasItems && <CartSummary cart={cart} layout={layout} />}
      </div>
    </section>
  );
}
