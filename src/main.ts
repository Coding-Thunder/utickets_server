import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000', // Add your frontend origin
      'http://localhost:3001', // Add your frontend origin
      'https://crm.rentalconfirmation.com', // Allow production origin
      'https://rentalconfirmation.com',
      'https://budgettravels4u.com'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    // credentials: true,
  });

  await app.listen(3002);
}
bootstrap();
