import { Cache, QueryInput } from '@urql/exchange-graphcache';

export function updateQueryWithTypes<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(
    qi,
    data => fn(result as Result, data as any) as any
  );
}
