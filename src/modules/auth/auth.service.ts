import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Redirect, UnauthorizedException } from '@nestjs/common';
import { SignInDto, SignUpDto } from './auth.dto';
import axios from 'axios';
import * as bcrypt from "bcrypt"
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly jwtService: JwtService
  ) { }
  async registerANewUser(body: SignUpDto) {
    try {
      if (body.password !== body.confirm_password) {
        return { message: 'Password and confim passwords do not match', status: HttpStatus.OK }
      }

      const userExists = await this.userModel.findOne({ email: body.email })

      if (userExists) {
        return { message: "User already exists please sign in", status: HttpStatus.CONFLICT, redirect: "/sign-in" }
      }
      delete body.confirm_password;

      const hashed = await this.$hashPassword(body.password)

      if (hashed) {
        body.password = hashed
      }



      const newUser = await this.userModel.create(body)

      const token = await this.$generateJwtToken(body.email);

      const user = { full_name: newUser.full_name, email: newUser.email }


      return { redirect: "/sign-in-success", message: "Signup success", user, token: `Bearer ${token}`, status: HttpStatus.CREATED }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }


  async existingUserLogin(body: SignInDto) {
    try {
      const userExists = await this.userModel.findOne({ email: body.email })

      if (!body || !(await this.$comparePassword(body.password, userExists.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }
      // Generate and return JWT token
      const token = await this.$generateJwtToken(userExists.email);
      const user = { full_name: userExists.full_name, email: userExists.email }
      return { status: HttpStatus.OK, user, token: `Bearer ${token}`, redirect: "/" };
    } catch (error) {
      throw new InternalServerErrorException("Login Failed")
    }
  }

  async verifyRecaptcha(recaptchaToken: string): Promise<boolean> {
    const secretKey = 'YOUR_GOOGLE_RECAPTCHA_SECRET_KEY';

    try {
      const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
        params: {
          secret: secretKey,
          response: recaptchaToken,
        },
      });

      const { success } = response.data;
      return success;
    } catch (error) {
      throw new HttpException('Error verifying reCAPTCHA', HttpStatus.BAD_REQUEST);
    }
  }

  async $hashPassword(password: string) {
    const rounds = 10;
    const hash = await bcrypt.hash(password, rounds)
    return hash
  }

  async $comparePassword(password: string, hash) {
    const isMatch = await bcrypt.compare(password, hash)
    return isMatch
  }

  // Method to generate a JWT token
  async $generateJwtToken(userId: string): Promise<string> {
    const payload = { userId };
    return this.jwtService.sign(payload);
  }

  // Method to verify a JWT token
  async $verifyJwtToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}
