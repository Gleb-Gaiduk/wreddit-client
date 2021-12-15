import { cacheExchange, Resolver } from '@urql/exchange-graphcache';
import { FieldsOnCorrectTypeRule } from 'graphql';
import Router from 'next/router';
import {
  dedupExchange,
  Exchange,
  fetchExchange,
  stringifyVariables,
} from 'urql';
import { pipe, tap } from 'wonka';
import {
  LoginMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from '../generated/graphql';
import { updateQueryWithTypes } from './updateQueryWithTypes';

// Global error handler
const errorExchange: Exchange =
  ({ forward }) =>
  ops$ => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        if (error?.message.includes('not authenticated')) {
          Router.replace('/login');
        }
      })
    );
  };

// Understand implementation: 7.22.00
const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter(info => info.fieldName === fieldName);
    const size = fieldInfos.length;

    if (size === 0) return undefined;

    const fieldKey = `${fieldName}(${stringifyVariables(
      FieldsOnCorrectTypeRule
    )})`;

    const isInCache = cache.resolve(
      cache.resolve(entityKey, fieldKey) as string,
      'posts'
    );
    info.partial = !isInCache;

    let hasMore = true;

    const results: string[] = [];
    fieldInfos.forEach(fi => {
      const key = cache.resolve(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, 'posts') as string[];
      const _hasMore = Boolean(cache.resolve(key, 'hasMore'));

      if (!_hasMore) hasMore = _hasMore;
      results.push(...data);
    });

    return { __typename: 'PaginatedPosts', hasMore, posts: results };
  };
};

export const createUrqlClient = (ssrExchange: any) => ({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include' as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      keys: {
        PaginatedPosts: () => null,
      },
      resolvers: {
        Query: {
          posts: cursorPagination(),
        },
      },
      // We need to update cached auth query result after calling login mutation
      updates: {
        Mutation: {
          login: (result, args, cache, info) => {
            updateQueryWithTypes<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              result,
              (_result, _cache) => {
                console.log(_result, result);
                if (_result.login.errors) return _cache;
                return {
                  // Allowed direct object mutation
                  auth: _result.login.user,
                };
              }
            );
          },

          register: (result, args, cache, info) => {
            updateQueryWithTypes<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              result,
              (_result, _cache) => {
                if (_result.register.errors) return _cache;
                return {
                  auth: _result.register.user,
                };
              }
            );
          },

          logout: (result, args, cache, info) => {
            // Update cached auth me query with null
            updateQueryWithTypes(cache, { query: MeDocument }, result, () => ({
              auth: null,
            }));
          },
        },
      },
    }),
    // Global error handler
    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
});
