import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { AmadeusModule } from 'src/amadeus/amadeus.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Make ConfigModule global
    MongooseModule.forRoot(`${process.env.DATABASE_MONGO_URI}`),
    AuthModule,
    AmadeusModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
