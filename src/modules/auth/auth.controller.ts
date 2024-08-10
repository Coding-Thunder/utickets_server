import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './auth.dto';

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("/register-a-new-user")
  async registerANewUser(
    @Body() body: SignUpDto
  ) {
    // const isRecaptchaValid = await this.authService.verifyRecaptcha(body.recaptchaToken)

    // if (!isRecaptchaValid) {
    //   throw new HttpException('Invalid reCAPTCHA', HttpStatus.BAD_REQUEST);
    // }
    return this.authService.registerANewUser(body);
  }


  @Post("existing-user-login")
  existingUserLogin(
    @Body() body: SignInDto
  ): Record<string, any> {
    return this.authService.existingUserLogin(body)
  }
}
