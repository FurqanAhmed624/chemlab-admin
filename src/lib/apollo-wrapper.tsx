"use client";

import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client";

function makeClient() {
  const httpLink = createHttpLink({
    // Point to the path handled by your middleware.
    uri: '/graphql',
  });

  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return <ApolloProvider client={makeClient()}>{children}</ApolloProvider>;
}