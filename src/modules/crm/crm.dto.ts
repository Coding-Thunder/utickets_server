// crm/crm.dto.ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateEmployeeDto {
    @IsNotEmpty()
    @IsString()
    code: string; // Custom employee code

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    role: string;
}



export class SendOtpDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class VerifyOtpDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    otp: string;
}