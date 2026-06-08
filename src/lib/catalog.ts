import catalogJson from '../../data/catalog.json';
import type {
  Article,
  Blog,
  Catalog,
  Collection,
  Page,
  PaginatedConnection,
  Policy,
  Product,
  ProductSummary,
} from './types';

const catalog = catalogJson as Catalog;

const productByHandle = new Map(
  catalog.products.map((product) => [product.handle, product]),
);
const productById = new Map(
  catalog.products.map((product) => [product.id, product]),
);
const variantById = new Map(
  catalog.products.flatMap((product) =>
    product.variants.map((variant) => [variant.id, {product, variant}]),
  ),
);
const collectionByHandle = new Map(
  catalog.collections.map((collection) => [collection.handle, collection]),
);
const pageByHandle = new Map(
  catalog.pages.map((page) => [page.handle, page]),
);
const policyByHandle = new Map(
  catalog.policies.map((policy) => [policy.handle, policy]),
);
const blogByHandle = new Map(
  catalog.blogs.map((blog) => [blog.handle, blog]),
);

export function getCatalog(): Catalog {
  return catalog;
}

export function getShop() {
  return catalog.shop;
}

export function getHeaderMenu() {
  return catalog.headerMenu;
}

export function getFooterMenu() {
  return catalog.footerMenu;
}

export function getProductByHandle(handle: string): Product | undefined {
  return productByHandle.get(handle);
}

export function getVariantById(variantId: string) {
  return variantById.get(variantId);
}

export function getProductSummary(product: Product): ProductSummary {
  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    featuredImage: product.featuredImage,
    priceRange: product.priceRange,
  };
}

export function getAllProductSummaries(): ProductSummary[] {
  return catalog.products.map(getProductSummary);
}

export function getCollectionByHandle(handle: string): Collection | undefined {
  return collectionByHandle.get(handle);
}

export function getAllCollections(): Collection[] {
  return catalog.collections;
}

export function getCollectionProducts(
  collection: Collection,
): ProductSummary[] {
  return collection.productHandles
    .map((handle) => productByHandle.get(handle))
    .filter((product): product is Product => Boolean(product))
    .map(getProductSummary);
}

export function getPageByHandle(handle: string): Page | undefined {
  return pageByHandle.get(handle);
}

export function getPolicyByHandle(handle: string): Policy | undefined {
  return policyByHandle.get(handle);
}

export function getAllPolicies(): Policy[] {
  return catalog.policies;
}

export function getBlogByHandle(handle: string): Blog | undefined {
  return blogByHandle.get(handle);
}

export function getAllBlogs(): Blog[] {
  return catalog.blogs;
}

export function getArticle(
  blogHandle: string,
  articleHandle: string,
): {blog: Blog; article: Article} | undefined {
  const blog = blogByHandle.get(blogHandle);
  if (!blog) return undefined;
  const article = blog.articles.find((item) => item.handle === articleHandle);
  if (!article) return undefined;
  return {blog, article};
}

export function getFeaturedCollection(): Collection | undefined {
  return catalog.collections.find((c) => c.handle === 'featured') ?? catalog.collections[0];
}

export function getRecommendedProducts(limit = 4): ProductSummary[] {
  return getAllProductSummaries().slice(0, limit);
}

export function paginate<T>(
  items: T[],
  {first, after}: {first: number; after?: string | null},
): PaginatedConnection<T> {
  let start = 0;
  if (after) {
    const index = Number(after);
    start = Number.isFinite(index) ? index + 1 : 0;
  }
  const nodes = items.slice(start, start + first);
  const end = start + nodes.length - 1;

  return {
    nodes,
    pageInfo: {
      hasNextPage: start + first < items.length,
      hasPreviousPage: start > 0,
      startCursor: nodes.length ? String(start) : null,
      endCursor: nodes.length ? String(end) : null,
    },
  };
}

export type SearchResults = {
  products: PaginatedConnection<ProductSummary>;
  collections: PaginatedConnection<Collection>;
  pages: PaginatedConnection<Page>;
  articles: PaginatedConnection<Article & {blogHandle: string}>;
  total: number;
};

function matchesTerm(text: string, term: string) {
  return text.toLowerCase().includes(term.toLowerCase());
}

export function searchCatalog(
  term: string,
  limit = 10,
): SearchResults {
  const normalized = term.trim();
  if (!normalized) {
    return {
      products: paginate([], {first: limit}),
      collections: paginate([], {first: limit}),
      pages: paginate([], {first: limit}),
      articles: paginate([], {first: limit}),
      total: 0,
    };
  }

  const products = catalog.products
    .filter(
      (p) =>
        matchesTerm(p.title, normalized) ||
        matchesTerm(p.description, normalized) ||
        matchesTerm(p.vendor, normalized),
    )
    .map(getProductSummary);

  const collections = catalog.collections.filter(
    (c) =>
      matchesTerm(c.title, normalized) ||
      matchesTerm(c.description ?? '', normalized),
  );

  const pages = catalog.pages.filter(
    (p) => matchesTerm(p.title, normalized) || matchesTerm(p.body, normalized),
  );

  const articles = catalog.blogs.flatMap((blog) =>
    blog.articles
      .filter(
        (a) =>
          matchesTerm(a.title, normalized) ||
          matchesTerm(a.content, normalized),
      )
      .map((article) => ({...article, blogHandle: blog.handle})),
  );

  const productPage = paginate(products, {first: limit});
  const collectionPage = paginate(collections, {first: limit});
  const pagePage = paginate(pages, {first: limit});
  const articlePage = paginate(articles, {first: limit});

  return {
    products: productPage,
    collections: collectionPage,
    pages: pagePage,
    articles: articlePage,
    total:
      productPage.nodes.length +
      collectionPage.nodes.length +
      pagePage.nodes.length +
      articlePage.nodes.length,
  };
}

export function predictiveSearch(term: string, limit = 5) {
  const results = searchCatalog(term, limit);
  return {
    total: results.total,
    items: {
      products: results.products.nodes,
      collections: results.collections.nodes,
      pages: results.pages.nodes,
      articles: results.articles.nodes,
      queries: term
        ? [{text: term, styledText: term}]
        : [],
    },
  };
}
