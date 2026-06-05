import {EurMoney} from '~/components/EurMoney';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

export function ProductPrice({
  price,
  compareAtPrice,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
}) {
  return (
    <div
      aria-label="Price"
      className="text-lg font-semibold text-neutral-900"
      role="group"
    >
      {compareAtPrice ? (
        <div className="flex items-baseline gap-2">
          {price ? <EurMoney data={price} /> : null}
          <s className="text-base font-normal text-neutral-500">
            <EurMoney data={compareAtPrice} />
          </s>
        </div>
      ) : price ? (
        <EurMoney data={price} />
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
}
