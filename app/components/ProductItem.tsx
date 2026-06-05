import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {EurMoney} from '~/components/EurMoney';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

export function ProductItem({
  product,
  loading,
}: {
  product:
    | CollectionItemFragment
    | ProductItemFragment
    | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  return (
    <Link
      className="group flex flex-col gap-3 overflow-hidden rounded-lg border border-neutral-200 bg-white no-underline transition hover:border-neutral-400 hover:no-underline hover:shadow-md"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {image && (
        <div className="overflow-hidden rounded-t-lg bg-neutral-100">
          <Image
            alt={image.altText || product.title}
            aspectRatio="1/1"
            className="h-auto w-full transition duration-300 group-hover:scale-[1.02]"
            data={image}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
          />
        </div>
      )}
      <div className="flex flex-col gap-1 px-3 pb-3">
        <h4 className="text-sm font-medium text-neutral-900">
          {product.title}
        </h4>
        <small className="text-sm text-neutral-600">
          <EurMoney data={product.priceRange.minVariantPrice} />
        </small>
      </div>
    </Link>
  );
}
