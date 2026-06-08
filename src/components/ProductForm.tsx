import type {MappedProductOption} from '~/lib/product-options';
import type {ProductVariant} from '~/lib/types';
import {AddToCartButton} from '~/components/AddToCartButton';

export function ProductForm({
  productOptions,
  selectedVariant,
  basePath,
}: {
  productOptions: MappedProductOption[];
  selectedVariant: ProductVariant | undefined;
  basePath: string;
}) {
  const optionButtonClass = (selected: boolean, available: boolean) =>
    [
      'cursor-pointer rounded-md border px-3 py-2 text-sm no-underline transition hover:no-underline',
      selected ? 'border-neutral-900 ring-2 ring-neutral-900 ring-offset-1' : 'border-neutral-200 hover:border-neutral-400',
      available ? 'opacity-100' : 'opacity-30',
    ].join(' ');

  return (
    <div className="flex flex-col gap-6">
      {productOptions.map((option) => {
        if (option.optionValues.length === 1) return null;
        return (
          <div className="flex flex-col gap-3" key={option.name}>
            <h5 className="text-sm font-medium uppercase tracking-wide text-neutral-700">{option.name}</h5>
            <div className="flex flex-wrap gap-2">
              {option.optionValues.map((value) => (
                <a
                  key={option.name + value.name}
                  href={`${basePath}?${value.variantUriQuery}`}
                  className={optionButtonClass(value.selected, value.available)}
                  aria-disabled={!value.exists}
                >
                  {value.name}
                </a>
              ))}
            </div>
          </div>
        );
      })}
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        lines={selectedVariant ? [{merchandiseId: selectedVariant.id, quantity: 1}] : []}
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}
