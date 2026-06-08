import {defineMiddleware} from 'astro:middleware';
import {createCartService, isLoggedIn} from '~/lib/cart';

export const onRequest = defineMiddleware(async (context, next) => {
  const cookie = context.request.headers.get('cookie') ?? '';
  context.locals.cart = createCartService(cookie);
  context.locals.isLoggedIn = isLoggedIn(cookie);
  return next();
});
