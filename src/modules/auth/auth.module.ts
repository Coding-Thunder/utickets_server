import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from 'src/schemas/user.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.TOKEN_SECRET || "0a3c8f79b80d07a0ff9c9d586cf1e3e5bce3d21a0d7f9f545a9d013b2e1a4c4b",
      signOptions: { expiresIn: "7d" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
