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
// 1. Ek Express instance banayein
const server = express();

let isAppInitialized = false;
let initPromise: Promise<any> | null = null;

// 2. Core setup function taake configurations ek hi jagah rahin
async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // Aapki CORS Setting
  const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map(url => url.trim().replace(/\/$/, ''))
    : [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3003',
      ];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

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

// 3. Vercel Serverless Handler Wrapper to avoid cold start / async race condition
const handler = async (req: any, res: any) => {
  if (!isAppInitialized) {
    if (!initPromise) {
      initPromise = bootstrap();
    }
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