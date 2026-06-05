import type {ProductVariantFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';

export function ProductImage({
  image,
}: {
  image: ProductVariantFragment['image'];
}) {
  if (!image) {
    return (
      <div className="aspect-square w-full rounded-lg bg-neutral-100" />
    );
  }
  return (
    <div className="overflow-hidden rounded-lg bg-neutral-100">
      <Image
        alt={image.altText || 'Product Image'}
        aspectRatio="1/1"
        className="h-auto w-full"
        data={image}
        key={image.id}
        sizes="(min-width: 45em) 50vw, 100vw"
      />
    </div>
  );
}
