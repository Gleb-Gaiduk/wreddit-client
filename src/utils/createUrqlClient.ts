import { cacheExchange } from '@urql/exchange-graphcache';
import { dedupExchange, fetchExchange } from 'urql';
import {
  LoginMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from '../generated/graphql';
import { updateQueryWithTypes } from './updateQueryWithTypes';

export const createUrqlClient = (ssrExchange: any) => ({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include' as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
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
    ssrExchange,
    fetchExchange,
  ],
});
