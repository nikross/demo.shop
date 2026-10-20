import {defineMiddleware} from 'astro:middleware';
import {createCartService} from '~/lib/cart';

export const onRequest = defineMiddleware(async (context, next) => {
  const cookie = context.request.headers.get('cookie') ?? '';
  context.locals.cart = createCartService(cookie);
  return next();
});
