import * as dotenv from 'dotenv';
// Load environment variables from .env file
dotenv.config();

import { PrismaClient, EnrollmentMode } from '@prisma/client';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import * as ws from 'ws';

// Set up the Neon adapter configuration for the seed script
const WebSocketCtor = (ws as any).WebSocket || (ws as any).default || ws;
neonConfig.webSocketConstructor = WebSocketCtor as any;
(neonConfig as any).fetch = (globalThis as any).fetch;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not defined in .env');
}

const poolConfig = { connectionString };
const adapter = new PrismaNeon(poolConfig);
const prisma = new PrismaClient({ adapter });

async function main() {
  const countries = [
    { name: 'Pakistan', code: 'PK', currency: 'PKR', supportedModes: [EnrollmentMode.GROUP, EnrollmentMode.ONE_ON_ONE] },
    { name: 'Australia', code: 'AU', currency: 'AUD', supportedModes: [EnrollmentMode.ONE_ON_ONE] },
    { name: 'Canada', code: 'CA', currency: 'CAD', supportedModes: [EnrollmentMode.ONE_ON_ONE] },
    { name: 'Europe', code: 'DE', currency: 'EUR', supportedModes: [EnrollmentMode.ONE_ON_ONE] },
    { name: 'Saudi Arabia', code: 'SA', currency: 'SAR', supportedModes: [EnrollmentMode.ONE_ON_ONE] },
    { name: 'Kuwait', code: 'KW', currency: 'KWD', supportedModes: [EnrollmentMode.ONE_ON_ONE] },
    { name: 'Qatar', code: 'QA', currency: 'QAR', supportedModes: [EnrollmentMode.ONE_ON_ONE] },
    { name: 'UAE', code: 'AE', currency: 'AED', supportedModes: [EnrollmentMode.ONE_ON_ONE] },
    { name: 'United Kingdom', code: 'GB', currency: 'GBP', supportedModes: [EnrollmentMode.ONE_ON_ONE] },
    { name: 'United States', code: 'US', currency: 'USD', supportedModes: [EnrollmentMode.ONE_ON_ONE] },
    { name: 'Others', code: 'OTHERS', currency: 'USD', supportedModes: [EnrollmentMode.ONE_ON_ONE] },
  ];

  console.log('Seeding countries...');
  for (const c of countries) {
    const result = await prisma.country.upsert({
      where: { code: c.code },
      update: {
        name: c.name,
        currency: c.currency,
        supportedModes: c.supportedModes,
      },
      create: {
        name: c.name,
        code: c.code,
        currency: c.currency,
        supportedModes: c.supportedModes,
      },
    });
    console.log(`Upserted country: ${result.name} (${result.code})`);
  }
  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
