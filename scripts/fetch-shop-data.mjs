/**
 * One-time script: pulls catalog data from mock.shop and stores it locally.
 * Run: node scripts/fetch-shop-data.mjs
 */
import {mkdir, writeFile} from 'node:fs/promises';
import {createWriteStream} from 'node:fs';
import {pipeline} from 'node:stream/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const IMAGES_DIR = path.join(ROOT, 'public', 'images');

const API_URL = 'https://mock.shop/api/2025-01/graphql.json';
const TOKEN = '123';

async function gql(query, variables = {}) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({query, variables}),
  });
  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '));
  }
  return json.data;
}

const imageUrlMap = new Map();

function localImagePath(remoteUrl) {
  if (!remoteUrl) return null;
  if (imageUrlMap.has(remoteUrl)) return imageUrlMap.get(remoteUrl);

  const url = new URL(remoteUrl);
  const filename = path.basename(url.pathname).split('?')[0] || 'image.jpg';
  const local = `/images/${filename}`;
  imageUrlMap.set(remoteUrl, {local, remote: remoteUrl, filename});
  return imageUrlMap.get(remoteUrl);
}

function remapImage(img) {
  if (!img?.url) return img;
  const mapped = localImagePath(img.url);
  return {...img, url: mapped.local};
}

async function downloadImages() {
  await mkdir(IMAGES_DIR, {recursive: true});
  const entries = [...imageUrlMap.values()];
  console.log(`Downloading ${entries.length} images…`);

  await Promise.all(
    entries.map(async ({remote, filename}) => {
      const dest = path.join(IMAGES_DIR, filename);
      try {
        const res = await fetch(remote);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        await pipeline(res.body, createWriteStream(dest));
      } catch (err) {
        console.warn(`  skip ${filename}: ${err.message}`);
      }
    }),
  );
}

const PRODUCT_LIST_QUERY = `
  query Products($cursor: String) {
    products(first: 50, after: $cursor) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id handle title vendor description descriptionHtml
        featuredImage { id url altText width height }
        priceRange { minVariantPrice { amount currencyCode } }
        options {
          name
          optionValues {
            name
            firstSelectableVariant {
              id title availableForSale sku
              price { amount currencyCode }
              compareAtPrice { amount currencyCode }
              image { id url altText width height }
              selectedOptions { name value }
            }
            swatch { color image { previewImage { url } } }
          }
        }
        variants(first: 100) {
          nodes {
            id title availableForSale sku
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
            image { id url altText width height }
            selectedOptions { name value }
          }
        }
      }
    }
  }
`;

const COLLECTIONS_QUERY = `
  query Collections($cursor: String) {
    collections(first: 20, after: $cursor) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id handle title description
        image { id url altText width height }
        products(first: 50) {
          nodes { handle }
        }
      }
    }
  }
`;

const SHOP_QUERY = `
  query Shop {
    shop {
      id name description
      primaryDomain { url }
      privacyPolicy { id title handle body }
      shippingPolicy { id title handle body }
      termsOfService { id title handle body }
      refundPolicy { id title handle body }
    }
    menu(handle: "main-menu") {
      id
      items {
        id resourceId tags title type url
        items { id resourceId tags title type url }
      }
    }
    footer: menu(handle: "footer") {
      id
      items {
        id resourceId tags title type url
        items { id resourceId tags title type url }
      }
    }
  }
`;

const PAGES_QUERY = `
  query Pages {
    pages(first: 20) {
      nodes { id handle title body seo { title description } }
    }
  }
`;

const BLOGS_QUERY = `
  query Blogs {
    blogs(first: 10) {
      nodes {
        id handle title seo { title description }
        articles(first: 20) {
          nodes {
            id handle title content contentHtml publishedAt
            author { name }
            image { id url altText width height }
            seo { title description }
          }
        }
      }
    }
  }
`;

async function fetchAllProducts() {
  const products = [];
  let cursor = null;
  do {
    const data = await gql(PRODUCT_LIST_QUERY, {cursor});
    products.push(...data.products.nodes);
    cursor = data.products.pageInfo.hasNextPage
      ? data.products.pageInfo.endCursor
      : null;
  } while (cursor);
  return products;
}

async function fetchAllCollections() {
  const collections = [];
  let cursor = null;
  do {
    const data = await gql(COLLECTIONS_QUERY, {cursor});
    collections.push(...data.collections.nodes);
    cursor = data.collections.pageInfo.hasNextPage
      ? data.collections.pageInfo.endCursor
      : null;
  } while (cursor);
  return collections;
}

function normalizeProduct(product) {
  const variants = product.variants.nodes.map((v) => ({
    ...v,
    image: remapImage(v.image),
  }));

  const options = product.options.map((opt) => ({
    name: opt.name,
    optionValues: opt.optionValues.map((ov) => ({
      name: ov.name,
      swatch: ov.swatch,
      firstSelectableVariant: ov.firstSelectableVariant
        ? {
            ...ov.firstSelectableVariant,
            image: remapImage(ov.firstSelectableVariant.image),
          }
        : null,
    })),
  }));

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    vendor: product.vendor,
    description: product.description,
    descriptionHtml: product.descriptionHtml,
    featuredImage: remapImage(product.featuredImage),
    priceRange: product.priceRange,
    options,
    variants,
  };
}

function normalizeCollection(collection) {
  return {
    id: collection.id,
    handle: collection.handle,
    title: collection.title,
    description: collection.description,
    image: remapImage(collection.image),
    productHandles: collection.products.nodes.map((p) => p.handle),
  };
}

function normalizeMenus(shopData) {
  const remapMenuUrls = (menu) => {
    if (!menu) return menu;
    const remapItem = (item) => ({
      ...item,
      url: item.url?.replace(/^https?:\/\/[^/]+/, '') ?? item.url,
      items: (item.items ?? []).map(remapItem),
    });
    return {...menu, items: menu.items.map(remapItem)};
  };
  return {
    headerMenu: remapMenuUrls(shopData.menu),
    footerMenu: remapMenuUrls(shopData.footer),
  };
}

async function main() {
  await mkdir(DATA_DIR, {recursive: true});

  console.log('Fetching products…');
  const rawProducts = await fetchAllProducts();
  console.log(`  ${rawProducts.length} products`);

  console.log('Fetching collections…');
  const rawCollections = await fetchAllCollections();
  console.log(`  ${rawCollections.length} collections`);

  console.log('Fetching shop, pages, blogs…');
  const [shopData, pagesData, blogsData] = await Promise.all([
    gql(SHOP_QUERY),
    gql(PAGES_QUERY),
    gql(BLOGS_QUERY),
  ]);

  const products = rawProducts.map(normalizeProduct);
  const collections = rawCollections.map(normalizeCollection);
  const {headerMenu, footerMenu} = normalizeMenus(shopData);

  const pages = pagesData.pages.nodes;
  const blogs = blogsData.blogs.nodes.map((blog) => ({
    ...blog,
    articles: blog.articles.nodes.map((article) => ({
      ...article,
      image: remapImage(article.image),
    })),
  }));

  const policies = [
    shopData.shop.privacyPolicy,
    shopData.shop.shippingPolicy,
    shopData.shop.termsOfService,
    shopData.shop.refundPolicy,
  ].filter(Boolean);

  const shop = {
    id: shopData.shop.id,
    name: shopData.shop.name,
    description: shopData.shop.description,
    primaryDomain: shopData.shop.primaryDomain,
  };

  await downloadImages();

  const catalog = {
    shop,
    headerMenu,
    footerMenu,
    products,
    collections,
    pages,
    blogs,
    policies,
    fetchedAt: new Date().toISOString(),
  };

  await writeFile(
    path.join(DATA_DIR, 'catalog.json'),
    JSON.stringify(catalog, null, 2),
  );

  console.log(`Wrote data/catalog.json (${products.length} products, ${collections.length} collections)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
