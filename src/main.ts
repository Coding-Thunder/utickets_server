import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { sentTransactionalMail } from './utils/emails';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await sentTransactionalMail("TEST", "vinaymaheshwari35@gmail.com");

  app.enableCors({
    origin: [
      'http://localhost:3000', // Add your frontend origin
      'http://localhost:3001', // Add your frontend origin
      'https://crm.rentalconfirmation.com', // Allow production origin
      'https://rentalconfirmation.com'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3002);
}
bootstrap();
