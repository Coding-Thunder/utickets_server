import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());

  app.use((req: { method: string; }, res: { header: (arg0: string, arg1: string) => void; status: (arg0: number) => { (): any; new(): any; json: { (arg0: {}): any; new(): any; }; }; }, next: () => void) => {
    res.header("Access-Control-Allow-Origin",
      "https://universalticketss.com"
      // "http://localhost:3001"
    );
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
      return res.status(200).json({});
    }
    next();
  });
  app.enableCors({
    origin: "https://universalticketss.com", // Ensure no trailing slash
    // origin: "http://localhost:3001", // Ensure no trailing slash
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    // allowedHeaders: "*", // Add other headers if needed
  });


  await app.listen(process.env.DATABASE_PORT);
}
bootstrap();

