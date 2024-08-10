import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class SignUpDto {
    @IsString()
    @IsNotEmpty()
    full_name: string

    @IsEmail()
    email: string

    @IsStrongPassword()
    password: string

    @IsString()
    @IsNotEmpty()
    confirm_password: string

    // @IsString()
    // @IsNotEmpty()
    // recaptchaToken: string
}


export class SignInDto {
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}