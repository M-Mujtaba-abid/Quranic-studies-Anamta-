import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

/** GraphQL over HTTP: POST (queries/mutations), GET (playground), OPTIONS (CORS preflight) */
const GRAPHQL_CORS_METHODS = 'GET, POST, OPTIONS';

/** Headers sent by Apollo Client and fetchGraphQL */
const GRAPHQL_CORS_HEADERS =
  'Content-Type, Authorization, Accept, Origin, X-Requested-With';

function normalizeOrigin(origin: string): string {
  return origin.trim().replace(/\/+$/, '');
}

function getAllowedOrigins(): string[] {
  const defaults = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://quranic-studies-anamta-1eaq.vercel.app',
  ];

  const fromEnv = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map(normalizeOrigin).filter(Boolean)
    : [];

  return [...new Set([...defaults, ...fromEnv])];
}

function isOriginAllowed(origin: string | undefined, allowedOrigins: string[]): boolean {
  if (!origin) {
    return true;
  }

  return allowedOrigins.includes(normalizeOrigin(origin));
}

function applyCorsHeaders(req: any, res: any): boolean {
  const origin = req.headers?.origin as string | undefined;

  if (origin && !isOriginAllowed(origin, allowedOrigins)) {
    console.warn(`Blocked CORS origin: ${origin}`);
    return false;
  }

  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', normalizeOrigin(origin));
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', GRAPHQL_CORS_METHODS);
  res.setHeader('Access-Control-Allow-Headers', GRAPHQL_CORS_HEADERS);
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }

  return false;
}

const server = express();
const allowedOrigins = getAllowedOrigins();

server.use((req, res, next) => {
  if (applyCorsHeaders(req, res)) {
    return;
  }
  next();
});

let isAppInitialized = false;
let initPromise: Promise<any> | null = null;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.init();
  isAppInitialized = true;
  console.log('CORS allowed origins:', allowedOrigins.join(', '));
  return app;
}

function ensureBootstrapStarted(): Promise<any> {
  if (!initPromise) {
    initPromise = bootstrap().catch((err) => {
      initPromise = null;
      isAppInitialized = false;
      console.error('NestJS bootstrap failed', err);
      throw err;
    });
  }

  return initPromise;
}

const handler = async (req: any, res: any) => {
  if (applyCorsHeaders(req, res)) {
    return;
  }

  ensureBootstrapStarted();

  if (!isAppInitialized) {
    await initPromise;
  }

  return server(req, res);
};

if (!process.env.VERCEL) {
  bootstrap()
    .then(async (app) => {
      const port = process.env.PORT ?? 3001;
      await app.listen(port);
      console.log(`Server is running locally on port ${port}`);
    })
    .catch((err) => console.error('NestJS Local Startup Error', err));
}

export default handler;
