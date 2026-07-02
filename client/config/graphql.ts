import { env } from '../lib/env';

export const graphqlConfig = {
  endpoint: env.NEXT_PUBLIC_API_URL,
  cachePolicies: {
    public: 'cache-first' as const,
    dashboard: 'network-only' as const,
    crud: 'cache-and-network' as const,
    auth: 'no-cache' as const,
    payments: 'no-cache' as const,
  },
};
