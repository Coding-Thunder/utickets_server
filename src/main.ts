import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // CORS configuration
  app.enableCors({
    origin: "https://universalticketss.com", // Ensure no trailing slash
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  });

  // Start the application
  await app.listen(process.env.PORT || 3000); // Default to port 3000 if not specified
}
bootstrap();
