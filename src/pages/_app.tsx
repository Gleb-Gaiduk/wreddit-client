import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import { Cache, cacheExchange, QueryInput } from '@urql/exchange-graphcache';
import { AppProps } from 'next/dist/shared/lib/router/router';
import { createClient, dedupExchange, fetchExchange, Provider } from 'urql';
import {
  LoginMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from '../generated/graphql';
import theme from '../theme';

function updateQueryWithTypes<Result, Query>(
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

const client = createClient({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include',
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
    fetchExchange,
  ],
});

function MyApp({
  Component,
  pageProps,
}: {
  Component: any;
  pageProps: AppProps;
}) {
  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
