import {CartForm} from '~/components/CartForm';
import {EurMoney} from '~/components/EurMoney';
import {useAside} from '~/components/Aside';
import type {CartLine} from '~/lib/types';

function variantUrl(handle: string, options: Array<{name: string; value: string}>) {
  const params = new URLSearchParams();
  options.forEach((o) => params.set(o.name, o.value));
  const qs = params.toString();
  return `/products/${handle}${qs ? `?${qs}` : ''}`;
}

export function CartLineItem({
  line,
  layout,
}: {
  line: CartLine;
  layout: 'page' | 'aside';
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = variantUrl(product.handle, selectedOptions);
  const {close} = useAside();

  return (
    <li className="py-4">
      <div className="flex gap-4">
        {image && (
          <div className="size-[100px] shrink-0 overflow-hidden rounded-md bg-neutral-100">
            <img
              src={image.url}
              alt={title}
              className="h-full w-full object-cover"
              width={100}
              height={100}
              loading="lazy"
            />
          </div>
        )}
        <div>
          <a
            href={lineItemUrl}
            onClick={() => layout === 'aside' && close()}
            className="no-underline hover:underline"
          >
            <p><strong>{product.title}</strong></p>
          </a>
          <p className="text-sm font-medium">
            <EurMoney amount={line.cost.totalAmount.amount} />
          </p>
          <ul>
            {selectedOptions.map((option) => (
              <li key={option.name}>
                <small>{option.name}: {option.value}</small>
              </li>
            ))}
          </ul>
          <CartLineQuantity line={line} />
        </div>
      </div>
    </li>
  );
}

function CartLineQuantity({line}: {line: CartLine}) {
  const {id: lineId, quantity} = line;
  const prevQuantity = Math.max(0, quantity - 1);
  const nextQuantity = quantity + 1;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <small className="text-neutral-600">Qty: {quantity}</small>
      <CartForm action={CartForm.ACTIONS.LinesUpdate} inputs={{lines: [{id: lineId, quantity: prevQuantity}]}}>
        {({pending}) => (
          <button
            type="submit"
            aria-label="Decrease quantity"
            className="size-8 rounded-md border border-neutral-300 text-sm transition hover:border-neutral-900 disabled:opacity-40"
            disabled={quantity <= 1 || pending}
          >
            <span>&#8722;</span>
          </button>
        )}
      </CartForm>
      <CartForm action={CartForm.ACTIONS.LinesUpdate} inputs={{lines: [{id: lineId, quantity: nextQuantity}]}}>
        {({pending}) => (
          <button
            type="submit"
            aria-label="Increase quantity"
            className="size-8 rounded-md border border-neutral-300 text-sm transition hover:border-neutral-900 disabled:opacity-40"
            disabled={pending}
          >
            <span>&#43;</span>
          </button>
        )}
      </CartForm>
      <CartForm action={CartForm.ACTIONS.LinesRemove} inputs={{lineIds: [lineId]}}>
        {({pending}) => (
          <button
            type="submit"
            disabled={pending}
            className="text-sm text-neutral-500 underline transition hover:text-neutral-900 disabled:opacity-40"
          >
            Remove
          </button>
        )}
      </CartForm>
    </div>
  );
}
