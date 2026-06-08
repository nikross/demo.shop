export type Money = {
  amount: string;
  currencyCode: string;
};

export type ShopImage = {
  id?: string;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

export type SelectedOption = {
  name: string;
  value: string;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  sku?: string | null;
  price: Money;
  compareAtPrice?: Money | null;
  image?: ShopImage | null;
  selectedOptions: SelectedOption[];
};

export type ProductOptionValue = {
  name: string;
  swatch?: {
    color?: string | null;
    image?: {previewImage?: {url?: string | null} | null} | null;
  } | null;
  firstSelectableVariant?: ProductVariant | null;
};

export type ProductOption = {
  name: string;
  optionValues: ProductOptionValue[];
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  description: string;
  descriptionHtml: string;
  featuredImage?: ShopImage | null;
  priceRange: {
    minVariantPrice: Money;
  };
  options: ProductOption[];
  variants: ProductVariant[];
};

export type ProductSummary = Pick<
  Product,
  'id' | 'handle' | 'title' | 'featuredImage' | 'priceRange'
>;

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description?: string | null;
  image?: ShopImage | null;
  productHandles: string[];
};

export type MenuItem = {
  id: string;
  resourceId?: string | null;
  tags: string[];
  title: string;
  type: string;
  url: string;
  items?: MenuItem[];
};

export type Menu = {
  id: string;
  items: MenuItem[];
};

export type Shop = {
  id: string;
  name: string;
  description: string;
  primaryDomain: {url: string};
};

export type Page = {
  id: string;
  handle: string;
  title: string;
  body: string;
  seo?: {title?: string | null; description?: string | null};
};

export type Article = {
  id: string;
  handle: string;
  title: string;
  content: string;
  contentHtml?: string;
  publishedAt: string;
  author?: {name: string} | null;
  image?: ShopImage | null;
  seo?: {title?: string | null; description?: string | null};
};

export type Blog = {
  id: string;
  handle: string;
  title: string;
  seo?: {title?: string | null; description?: string | null};
  articles: Article[];
};

export type Policy = {
  id: string;
  handle: string;
  title: string;
  body: string;
};

export type Catalog = {
  shop: Shop;
  headerMenu: Menu;
  footerMenu: Menu;
  products: Product[];
  collections: Collection[];
  pages: Page[];
  blogs: Blog[];
  policies: Policy[];
  fetchedAt: string;
};

export type CartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    availableForSale: boolean;
    image?: ShopImage | null;
    price: Money;
    product: {
      id: string;
      handle: string;
      title: string;
      vendor: string;
    };
    selectedOptions: SelectedOption[];
  };
  cost: {
    totalAmount: Money;
    amountPerQuantity: Money;
  };
};

export type Cart = {
  id: string;
  updatedAt: string;
  totalQuantity: number;
  checkoutUrl: string;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
    totalDutyAmount: Money;
  };
  lines: {
    nodes: CartLine[];
  };
  discountCodes: Array<{code: string; applicable: boolean}>;
};

export type PaginatedConnection<T> = {
  nodes: T[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
};

export type CartService = {
  get: () => Promise<Cart | null>;
  addLines: (
    lines: Array<{merchandiseId: string; quantity: number}>,
  ) => Promise<{cart: Cart; headers: Headers}>;
  updateLines: (
    lines: Array<{id: string; quantity: number}>,
  ) => Promise<{cart: Cart; headers: Headers}>;
  removeLines: (lineIds: string[]) => Promise<{cart: Cart; headers: Headers}>;
};
