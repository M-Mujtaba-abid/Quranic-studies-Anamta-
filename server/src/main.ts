import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// Global variable taake Vercel app ko baar baar initialize na kare (Cold Start fix)
let app: any;

async function bootstrap() {
  const nestApp = await NestFactory.create(AppModule);

  // 1. NESTJS BUILT-IN CORS (Safety ke liye)
  nestApp.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://quranic-studies-anamta-1eaq.vercel.app',
      'https://quranic-studies-anamta.vercel.app'
      'https://anamata.live',
      'https://www.anamata.live',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 2. Global Pipes for Validation
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
  // ==========================================
  // ⚡ CORS SHORT-CIRCUIT (Bypass NestJS Boot)
  // ==========================================
  const origin = req.headers.origin;

  if (origin) {
    // Jo bhi allow origin se request aaye, usko accept kar lo
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');

  // Apollo-Require-Preflight add kiya hai kyunke Apollo Client aksar ye bhejta hai
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Apollo-Require-Preflight'
  );

  // Agar request sirf CORS check karne aayi hai, toh foran OK bhej do, aagay NestJS tak mat jane do!
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  // ==========================================

  // Agar normal (POST/GET) request hai, toh NestJS boot karo
  if (!app) {
    app = await bootstrap();
  }

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