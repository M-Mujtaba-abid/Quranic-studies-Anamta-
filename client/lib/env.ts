import { z } from 'zod';

function normalizeApiUrl(url: string): string {
  return url.trim().replace(/\/+$/, '').replace(/\/graphql\/?$/, '') + '/graphql';
}

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .string()
    .transform(normalizeApiUrl)
    .pipe(z.string().url())
    .default('http://localhost:3001/graphql'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NODE_ENV: process.env.NODE_ENV,
});

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;
