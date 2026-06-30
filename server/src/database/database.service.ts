// src/database/database.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import * as ws from 'ws';

// Neon DB ko WebSockets ke zariye fast connect karne ke liye
// Ensure we pass the actual WebSocket constructor (ws module exports it as .WebSocket)
const WebSocketCtor = (ws as any).WebSocket || (ws as any).default || ws;
neonConfig.webSocketConstructor = WebSocketCtor as any;

// If a global fetch is available (Node 18+), let neon use it. Otherwise it will fail later with "fetch failed".
(neonConfig as any).fetch = (globalThis as any).fetch;

@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // 1. Connection string ko .env se uthana
    const connectionString = process.env.DATABASE_URL;

    // 2. Neon connection config (PoolConfig) banana
    const poolConfig = { connectionString };

    // 3. Prisma Neon Adapter banana with config object
    const adapter = new PrismaNeon(poolConfig);

    // 4. PrismaClient ko adapter pass karna (Prisma v7 ka naya tareeqa)
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Neon DB Serverless Connected Successfully with Prisma v7!');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
