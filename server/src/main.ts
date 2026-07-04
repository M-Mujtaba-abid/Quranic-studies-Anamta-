// import 'dotenv/config';
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.enableCors({
//     origin: process.env.CLIENT_URL
//       ? process.env.CLIENT_URL.split(',')
//       : ['http://localhost:3000'],
//     credentials: true,
//   });

//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       transform: true,
//     }),
//   );

//   await app.listen(process.env.PORT ?? 3001);
//   console.log("Server is running on port", process.env.PORT ?? 3001);
// }
// bootstrap();



import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import cors from 'cors';

function normalizeOrigin(origin: string): string {
  return origin.trim().replace(/\/$/, '');
}

function getAllowedOrigins(): string[] {
  const defaults = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'https://anamtainstitute1.vercel.app',
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

// 1. Ek Express instance banayein
const server = express();
const allowedOrigins = getAllowedOrigins();

// Apply CORS on Express before Nest so preflight/OPTIONS work on Vercel too
server.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin, allowedOrigins)) {
        callback(null, true);
        return;
      }

      console.warn(`Blocked CORS origin: ${origin}`);
      callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  }),
);

let isAppInitialized = false;
let initPromise: Promise<any> | null = null;

// 2. Core setup function taake configurations ek hi jagah rahin
async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // Aapki Global Pipes Setting
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.init();
  isAppInitialized = true;
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

// 3. Vercel Serverless Handler Wrapper to avoid cold start / async race condition
const handler = async (req: any, res: any) => {
  ensureBootstrapStarted();

  // Preflight must not wait for NestJS cold start — CORS middleware is already on `server`
  if (req.method === 'OPTIONS') {
    return server(req, res);
  }

  if (!isAppInitialized) {
    await initPromise;
  }

  return server(req, res);
};

// Local startup check
if (!process.env.VERCEL) {
  bootstrap()
    .then(async (app) => {
      const port = process.env.PORT ?? 3001;
      await app.listen(port);
      console.log(`Server is running locally on port ${port}`);
    })
    .catch((err) => console.error('NestJS Local Startup Error', err));
}

// Export default handler
export default handler;