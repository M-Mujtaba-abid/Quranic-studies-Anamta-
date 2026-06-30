// prisma.config.ts
import 'dotenv/config';

import { defineConfig } from '@prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  // Prisma v7 expects the datasource URL in the config for migrations
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
