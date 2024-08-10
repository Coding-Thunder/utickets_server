import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS with detailed configuration
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
  });
  await app.listen(process.env.DATABASE_PORT);
}
bootstrap();
