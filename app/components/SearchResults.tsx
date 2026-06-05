import {Link} from 'react-router';
import {Image, Pagination} from '@shopify/hydrogen';
import {EurMoney} from '~/components/EurMoney';
import {urlWithTrackingParams, type RegularSearchReturn} from '~/lib/search';

type SearchItems = RegularSearchReturn['result']['items'];
type PartialSearchResult<ItemType extends keyof SearchItems> = Pick<
  SearchItems,
  ItemType
> &
  Pick<RegularSearchReturn, 'term'>;

type SearchResultsProps = RegularSearchReturn & {
  children: (args: SearchItems & {term: string}) => React.ReactNode;
};

export function SearchResults({
  term,
  result,
  children,
}: Omit<SearchResultsProps, 'error' | 'type'>) {
  if (!result?.total) {
    return null;
  }

  return children({...result.items, term});
}

SearchResults.Articles = SearchResultsArticles;
SearchResults.Pages = SearchResultsPages;
SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

function SearchResultsArticles({
  term,
  articles,
}: PartialSearchResult<'articles'>) {
  if (!articles?.nodes.length) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-neutral-900">Articles</h2>
      <ul className="flex flex-col gap-2">
        {articles?.nodes?.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.handle}`,
            trackingParams: article.trackingParameters,
            term,
          });

          return (
            <li key={article.id}>
              <Link
                prefetch="intent"
                to={articleUrl}
                className="text-neutral-700 underline-offset-2 hover:text-neutral-900 hover:underline"
              >
                {article.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function SearchResultsPages({term, pages}: PartialSearchResult<'pages'>) {
  if (!pages?.nodes.length) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-neutral-900">Pages</h2>
      <ul className="flex flex-col gap-2">
        {pages?.nodes?.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });

          return (
            <li key={page.id}>
              <Link
                prefetch="intent"
                to={pageUrl}
                className="text-neutral-700 underline-offset-2 hover:text-neutral-900 hover:underline"
              >
                {page.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function SearchResultsProducts({
  term,
  products,
}: PartialSearchResult<'products'>) {
  if (!products?.nodes.length) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-neutral-900">Products</h2>
      <Pagination connection={products}>
        {({nodes, isLoading, NextLink, PreviousLink}) => {
          const paginationLinkClass =
            'inline-flex items-center gap-1 rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900';

          const ItemsMarkup = nodes.map((product) => {
            const productUrl = urlWithTrackingParams({
              baseUrl: `/products/${product.handle}`,
              trackingParams: product.trackingParameters,
              term,
            });

            const price = product?.selectedOrFirstAvailableVariant?.price;
            const image = product?.selectedOrFirstAvailableVariant?.image;

            return (
              <li key={product.id}>
                <Link
                  prefetch="intent"
                  to={productUrl}
                  className="flex items-center gap-4 rounded-lg border border-neutral-200 p-3 transition hover:border-neutral-400 hover:bg-neutral-50"
                >
                  {image && (
                    <div className="size-14 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                      <Image
                        data={image}
                        alt={product.title}
                        width={50}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex flex-col gap-0.5">
                    <p className="font-medium text-neutral-900">
                      {product.title}
                    </p>
                    <small className="text-sm text-neutral-600">
                      {price && <EurMoney data={price} />}
                    </small>
                  </div>
                </Link>
              </li>
            );
          });

          return (
            <div className="flex flex-col gap-4">
              <PreviousLink>
                {isLoading ? (
                  <span className="text-sm text-neutral-500">Loading...</span>
                ) : (
                  <span className={paginationLinkClass}>
                    ↑ Load previous
                  </span>
                )}
              </PreviousLink>
              <ul className="flex flex-col gap-2">{ItemsMarkup}</ul>
              <NextLink>
                {isLoading ? (
                  <span className="text-sm text-neutral-500">Loading...</span>
                ) : (
                  <span className={paginationLinkClass}>Load more ↓</span>
                )}
              </NextLink>
            </div>
          );
        }}
      </Pagination>
    </section>
  );
}

function SearchResultsEmpty() {
  return (
    <p className="text-neutral-600">
      No results, try a different search.
    </p>
  );
}
