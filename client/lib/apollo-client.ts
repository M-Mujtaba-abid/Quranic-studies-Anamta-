import { HttpLink, InMemoryCache, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { env } from './env';
import { getCookie } from './cookies';

/**
 * Creates the Apollo Link chain:
 * RetryLink -> ErrorLink -> AuthLink -> HttpLink
 */
export function createApolloLink() {
  // 1. HTTP Link with credentials for cookie support
  const httpLink = new HttpLink({
    uri: env.NEXT_PUBLIC_API_URL,
    credentials: 'include', // Automatically send cookies
  });

  // 2. Authentication Link to forward JWT token in headers
  const authLink = setContext(async (_, { headers }) => {
    const token = await getCookie('token');
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  // 3. Error Interceptor Link
  const errorLink = onError(({ graphQLErrors, networkError }: any) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        console.error(
          `[GraphQL Error] Code: ${err.extensions?.code}, Message: ${err.message}`
        );

        // Standard auth expiration / invalid session check
        if (
          err.extensions?.code === 'UNAUTHENTICATED' ||
          err.message.includes('Unauthorized') ||
          err.message.includes('token is missing')
        ) {
          if (typeof window !== 'undefined') {
            // Trigger automatic redirect to login on auth failure
            window.location.href = '/admin/login';
          }
        }
      }
    }

    if (networkError) {
      console.error(`[Network Error] ${networkError.message}`);
    }
  });

  // 4. Retry Link for robust connectivity
  const retryLink = new RetryLink({
    delay: {
      initial: 300,
      max: 3000,
      jitter: true,
    },
    attempts: {
      max: 3,
      retryIf: (error) => !!error && typeof window !== 'undefined',
    },
  });

  // Compose all links: Retry -> Error -> Auth -> Http
  return ApolloLink.from([retryLink, errorLink, authLink, httpLink]);
}

/**
 * Configure cache settings with type policies
 */
export function createApolloCache() {
  return new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Add queries if pagination or merge behavior is required
        },
      },
    },
  });
}
