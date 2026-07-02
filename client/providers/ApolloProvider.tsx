'use client';

import React from 'react';
import { ApolloLink } from '@apollo/client';
import {
  NextSSRApolloClient,
  ApolloNextAppProvider,
  SSRMultipartLink,
  NextSSRInMemoryCache,
} from '@apollo/experimental-nextjs-app-support/ssr';
import { createApolloLink } from '../lib/apollo-client';

function makeClient() {
  const link = createApolloLink();
  const cache = new NextSSRInMemoryCache();

  return new NextSSRApolloClient({
    cache,
    link:
      typeof window === 'undefined'
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            link,
          ])
        : link,
  });
}

export function ApolloProvider({ children }: { children: React.ReactNode }) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
