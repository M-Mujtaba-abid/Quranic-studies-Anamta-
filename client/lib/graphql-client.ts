/**
 * A lightweight GraphQL client for both Client-side and Server-side fetches.
 * - On the client, it automatically carries cookies due to `credentials: 'include'`.
 * - On the server (SSR), it forwards cookies from `next/headers`.
 */
export async function fetchGraphQL<T = any>(
  query: string,
  variables: Record<string, any> = {},
  options: RequestInit = {}
): Promise<{ data?: T; errors?: any[] }> {
  const isServer = typeof window === 'undefined';
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (isServer) {
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const cookieHeader = cookieStore.toString();
      if (cookieHeader) {
        headers.set('Cookie', cookieHeader);
      }
    } catch (e) {
      console.warn('Could not read server cookies:', e);
    }
  }

  const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/graphql';
  const url = rawUrl.trim().replace(/\/+$/, '').replace(/\/graphql\/?$/, '') + '/graphql';

  try {
    const { headers: customHeaders, ...restOptions } = options;
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
      credentials: 'include', // Crucial for cookie-based authentication on the client
      ...restOptions,
    });

    if (!res.ok) {
      const text = await res.text();
      return {
        errors: [{ message: `HTTP error! Status: ${res.status}. Body: ${text}` }],
      };
    }

    return await res.json();
  } catch (error: any) {
    return {
      errors: [{ message: error?.message || 'Network request failed' }],
    };
  }
}
