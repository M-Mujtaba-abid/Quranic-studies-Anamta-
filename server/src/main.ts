import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// Global variable taake Vercel app ko baar baar initialize na kare (Cold Start fix)
let app: any;

async function bootstrap() {
  const nestApp = await NestFactory.create(AppModule);

  // 1. NESTJS BUILT-IN CORS (Yehi game changer hai!)
  nestApp.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://quranic-studies-anamta-1eaq.vercel.app', // Aapka exact Frontend URL
      'https://quranic-studies-anamta.vercel.app'       // Aapka Backend URL (safety ke liye)
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 2. Global Pipes
  nestApp.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await nestApp.init();
  return nestApp;
}

// 3. VERCEL SERVERLESS HANDLER
export default async function handler(req: any, res: any) {
  if (!app) {
    app = await bootstrap();
  }

  // Express ka instance direct Vercel ke req/res ko handle karega
  const instance = app.getHttpAdapter().getInstance();
  return instance(req, res);
}

// 4. LOCAL DEVELOPMENT (Jab aap local PC par chalayen)
if (!process.env.VERCEL) {
  bootstrap()
    .then(async (nestApp) => {
      const port = process.env.PORT ?? 3001;
      await nestApp.listen(port);
      console.log(`Server is running locally on port ${port}`);
    })
    .catch((err) => console.error('NestJS Local Startup Error', err));
}