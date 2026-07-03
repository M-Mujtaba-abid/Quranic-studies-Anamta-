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



import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
// import * as express from 'express';
import express from 'express';

// 1. Ek Express instance banayein
const server = express();

// 2. Core setup function taake configurations ek hi jagah rahin
async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // Aapki CORS Setting
  app.enableCors({
    origin: process.env.CLIENT_URL
      ? process.env.CLIENT_URL.split(',')
      : ['http://localhost:3000'],
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
  return app;
}

// 3. Environment check (Local vs Production)
if (process.env.VERCEL) {
  // Agar code Vercel par hai, toh sirf initialize karein (app.listen nahi chahiye)
  bootstrap()
    .then(() => console.log('NestJS Server Ready for Vercel'))
    .catch((err) => console.error('NestJS Initialization Error', err));
} else {
  // Agar locally chal raha hai, toh standard app.listen() trigger karein
  bootstrap()
    .then(async (app) => {
      const port = process.env.PORT ?? 3001;
      await app.listen(port);
      console.log(`Server is running locally on port ${port}`);
    })
    .catch((err) => console.error('NestJS Local Startup Error', err));
}

// 4. Vercel serverless function ke liye server export lazmi hai
export default server;