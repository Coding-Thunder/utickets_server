import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000', // Add your frontend origin
      'http://localhost:3001', // Add your frontend origin
      'https://flightbizz.com', // Allow production origin
      'https://crm.flightbizz.com', // Allow production origin
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3002);
}
bootstrap();
