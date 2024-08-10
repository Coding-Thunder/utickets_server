import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS with detailed configuration
  app.enableCors({
    origin: 'http://localhost:3000', // Replace with your Next.js frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: 'Content-Type, Authorization', // Specify allowed headers
    credentials: true, // Allow credentials (e.g., cookies)
    preflightContinue: false, // Let Nest.js handle preflight OPTIONS requests
  });
  await app.listen(process.env.DATABASE_PORT);
}
bootstrap();
