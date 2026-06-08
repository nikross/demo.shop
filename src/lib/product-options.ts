import type {Product, ProductVariant, SelectedOption} from '~/lib/types';

export function getSelectedOptionsFromRequest(
  request: Request,
  product: Product,
): SelectedOption[] {
  const url = new URL(request.url);
  return product.options
    .map((option) => {
      const value = url.searchParams.get(option.name);
      return value ? {name: option.name, value} : null;
    })
    .filter((option): option is SelectedOption => Boolean(option));
}

export function findMatchingVariant(
  product: Product,
  selectedOptions: SelectedOption[],
): ProductVariant | undefined {
  if (!selectedOptions.length) {
    return product.variants.find((v) => v.availableForSale) ?? product.variants[0];
  }

  return product.variants.find((variant) =>
    selectedOptions.every((selected) =>
      variant.selectedOptions.some(
        (option) =>
          option.name === selected.name && option.value === selected.value,
      ),
    ),
  );
}

export type MappedOptionValue = {
  name: string;
  selected: boolean;
  available: boolean;
  exists: boolean;
  variantUriQuery: string;
  swatch?: Product['options'][number]['optionValues'][number]['swatch'];
};

export type MappedProductOption = {
  name: string;
  optionValues: MappedOptionValue[];
};

export function getProductOptions(
  product: Product,
  selectedVariant: ProductVariant | undefined,
): MappedProductOption[] {
  const selectedOptions = selectedVariant?.selectedOptions ?? [];

  return product.options.map((option) => ({
    name: option.name,
    optionValues: option.optionValues.map((value) => {
      const nextOptions = selectedOptions
        .filter((selected) => selected.name !== option.name)
        .concat({name: option.name, value: value.name});

      const variant = product.variants.find((candidate) =>
        nextOptions.every((selected) =>
          candidate.selectedOptions.some(
            (item) =>
              item.name === selected.name && item.value === selected.value,
          ),
        ),
      );

      const params = new URLSearchParams();
      nextOptions.forEach((selected) => {
        params.set(selected.name, selected.value);
      });

      return {
        name: value.name,
        selected: selectedOptions.some(
          (selected) =>
            selected.name === option.name && selected.value === value.name,
        ),
        available: variant?.availableForSale ?? false,
        exists: Boolean(variant),
        variantUriQuery: params.toString(),
        swatch: value.swatch,
      };
    }),
  }));
}
