import type {APIRoute} from 'astro';
import {predictiveSearch} from '~/lib/catalog';
import {getEmptyPredictiveSearchResult} from '~/lib/search';

export const GET: APIRoute = async ({url}) => {
  const term = url.searchParams.get('q') ?? '';
  const limit = Number(url.searchParams.get('limit') ?? 5);

  const result = term
    ? predictiveSearch(term, limit)
    : getEmptyPredictiveSearchResult();

  return new Response(
    JSON.stringify({type: 'predictive', term, result}),
    {headers: {'Content-Type': 'application/json'}},
  );
};
