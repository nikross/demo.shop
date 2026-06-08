export function getPaginationVariables(
  request: Request,
  {pageBy}: {pageBy: number},
) {
  const url = new URL(request.url);
  const after = url.searchParams.get('cursor');
  return {first: pageBy, after};
}
