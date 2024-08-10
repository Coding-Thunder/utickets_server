import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS with detailed configuration
  app.enableCors({
    origin: 'https://universalticketss.com', // Allow your Next.js production URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you're using cookies or other credentials
  });

  await app.listen(process.env.DATABASE_PORT);
}
bootstrap();
