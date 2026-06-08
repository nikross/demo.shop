import {getVariantById} from '~/lib/catalog';
import type {Cart, CartLine, CartService, Money} from '~/lib/types';

const CART_COOKIE = 'mock-cart';
const AUTH_COOKIE = 'mock-auth';

type CartCookieData = {
  lines: Array<{variantId: string; quantity: number}>;
};

function eur(amount: number): Money {
  return {amount: amount.toFixed(2), currencyCode: 'EUR'};
}

function parseCartCookie(cookieHeader: string): CartCookieData {
  if (!cookieHeader) return {lines: []};
  const match = cookieHeader.match(new RegExp(`${CART_COOKIE}=([^;]+)`));
  if (!match) return {lines: []};
  try {
    return JSON.parse(decodeURIComponent(match[1])) as CartCookieData;
  } catch {
    return {lines: []};
  }
}

function serializeCartCookie(data: CartCookieData): string {
  return `${CART_COOKIE}=${encodeURIComponent(JSON.stringify(data))}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`;
}

function buildLine(
  lineId: string,
  variantId: string,
  quantity: number,
): CartLine | null {
  const match = getVariantById(variantId);
  if (!match) return null;
  const {product, variant} = match;
  const unitPrice = Number(variant.price.amount);

  return {
    id: lineId,
    quantity,
    merchandise: {
      id: variant.id,
      title: variant.title,
      availableForSale: variant.availableForSale,
      image: variant.image ?? product.featuredImage,
      price: variant.price,
      product: {
        id: product.id,
        handle: product.handle,
        title: product.title,
        vendor: product.vendor,
      },
      selectedOptions: variant.selectedOptions,
    },
    cost: {
      totalAmount: eur(unitPrice * quantity),
      amountPerQuantity: variant.price,
    },
  };
}

function buildCart(data: CartCookieData): Cart | null {
  const lines = data.lines
    .map((line, index) => buildLine(`line-${index}`, line.variantId, line.quantity))
    .filter((line): line is CartLine => Boolean(line));

  if (!lines.length) return null;

  const subtotal = lines.reduce(
    (sum, line) => sum + Number(line.cost.totalAmount.amount),
    0,
  );
  const totalQuantity = lines.reduce((sum, line) => sum + line.quantity, 0);

  return {
    id: 'mock-cart',
    updatedAt: new Date().toISOString(),
    totalQuantity,
    checkoutUrl: '/checkout',
    cost: {
      subtotalAmount: eur(subtotal),
      totalAmount: eur(subtotal),
      totalTaxAmount: eur(0),
      totalDutyAmount: eur(0),
    },
    lines: {nodes: lines},
    discountCodes: [],
  };
}

function emptyCart(): Cart {
  return {
    id: 'mock-cart',
    updatedAt: new Date().toISOString(),
    totalQuantity: 0,
    checkoutUrl: '/checkout',
    cost: {
      subtotalAmount: eur(0),
      totalAmount: eur(0),
      totalTaxAmount: eur(0),
      totalDutyAmount: eur(0),
    },
    lines: {nodes: []},
    discountCodes: [],
  };
}

function withCartHeaders(cartData: CartCookieData): Headers {
  const headers = new Headers();
  headers.append('Set-Cookie', serializeCartCookie(cartData));
  return headers;
}

export function createCartService(cookieHeader: string): CartService {
  const getData = () => parseCartCookie(cookieHeader);

  return {
    async get() {
      return buildCart(getData());
    },

    async addLines(lines) {
      const data = getData();
      for (const line of lines) {
        const existing = data.lines.find(
          (item) => item.variantId === line.merchandiseId,
        );
        if (existing) existing.quantity += line.quantity;
        else data.lines.push({variantId: line.merchandiseId, quantity: line.quantity});
      }
      const cart = buildCart(data)!;
      return {cart, headers: withCartHeaders(data)};
    },

    async updateLines(lines) {
      const data = getData();
      for (const line of lines) {
        const index = Number(line.id.replace('line-', ''));
        if (!Number.isFinite(index) || !data.lines[index]) continue;
        if (line.quantity <= 0) data.lines.splice(index, 1);
        else data.lines[index].quantity = line.quantity;
      }
      return {cart: buildCart(data) ?? emptyCart(), headers: withCartHeaders(data)};
    },

    async removeLines(lineIds) {
      const data = getData();
      const indexes = lineIds
        .map((id) => Number(id.replace('line-', '')))
        .filter((index) => Number.isFinite(index))
        .sort((a, b) => b - a);
      for (const index of indexes) data.lines.splice(index, 1);
      return {cart: buildCart(data) ?? emptyCart(), headers: withCartHeaders(data)};
    },
  };
}

export function isLoggedIn(cookieHeader: string): boolean {
  return new RegExp(`${AUTH_COOKIE}=1`).test(cookieHeader);
}

export function authSuccessCookie(): string {
  return `${AUTH_COOKIE}=1; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`;
}

export function getCartCookieHeader(cartData: CartCookieData): string {
  return serializeCartCookie(cartData);
}

export {parseCartCookie, serializeCartCookie, emptyCart};
