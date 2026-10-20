import type {APIContext, APIRoute} from 'astro';

/**
 * The visitor's IP. Behind Cloudflare and Vercel it comes from the proxy
 * headers; Astro's `clientAddress` throws when it can't determine one.
 */
export function getClientIp({request, clientAddress}: APIContext): string {
  const headers = request.headers;
  const forwarded =
    headers.get('x-real-ip') ??
    headers.get('cf-connecting-ip') ??
    headers.get('x-forwarded-for')?.split(',')[0];
  if (forwarded?.trim()) return forwarded.trim();
  try {
    return clientAddress;
  } catch {
    return '';
  }
}

/**
 * Returns unexpected errors as JSON (instead of Astro's empty 500), so the
 * demo UI and browser console show what went wrong.
 */
export function withJsonErrors(route: APIRoute): APIRoute {
  return async (context) => {
    try {
      return await route(context);
    } catch (error) {
      console.error(`[api] ${context.url.pathname} failed`, error);
      const message = error instanceof Error ? error.message : String(error);
      return new Response(
        JSON.stringify({ok: false, error: `Server error: ${message}`}),
        {status: 500, headers: {'Content-Type': 'application/json'}},
      );
    }
  };
}
