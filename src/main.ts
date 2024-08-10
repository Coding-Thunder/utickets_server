import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: "https://www.universalticketss.com", // Ensure no trailing slash
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization", // Add other headers if needed
    credentials: false, // Enable credentials
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });


  await app.listen(process.env.DATABASE_PORT);
}
bootstrap();
