import type {
  Article,
  Collection,
  Page,
  PaginatedConnection,
  ProductSummary,
} from '~/lib/types';

export type SearchItems = {
  products: PaginatedConnection<ProductSummary>;
  collections: PaginatedConnection<Collection>;
  pages: PaginatedConnection<Page>;
  articles: PaginatedConnection<Article & {blogHandle: string}>;
};

export type RegularSearchReturn = {
  type: 'regular';
  term: string;
  error?: string;
  result: {total: number; items: SearchItems};
};

export type PredictiveSearchReturn = {
  type: 'predictive';
  term: string;
  error?: string;
  result: {
    total: number;
    items: {
      products: ProductSummary[];
      collections: Collection[];
      pages: Page[];
      articles: Array<Article & {blogHandle: string}>;
      queries: Array<{text: string; styledText: string}>;
    };
  };
};

export function getEmptyPredictiveSearchResult(): PredictiveSearchReturn['result'] {
  return {
    total: 0,
    items: {
      articles: [],
      collections: [],
      products: [],
      pages: [],
      queries: [],
    },
  };
}

export function urlWithTrackingParams({
  baseUrl,
  term,
}: {
  baseUrl: string;
  term: string;
}) {
  const search = new URLSearchParams({q: term}).toString();
  return `${baseUrl}?${search}`;
}
