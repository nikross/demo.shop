import type {APIRoute} from 'astro';

export const GET: APIRoute = ({url}) => {
  const body = `User-agent: *
Disallow: /cart
Disallow: /account
Disallow: /search
Allow: /search/
Disallow: /search/?*`;

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': `max-age=${60 * 60 * 24}`,
    },
  });
};
