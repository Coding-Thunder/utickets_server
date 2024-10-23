// src/dto/create-booking.dto.ts
import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class TravelerDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  middleName?: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  dob: string; // Consider using a Date type with proper validation
}

export class CardInfoDto {
  @IsString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsNotEmpty()
  month: string;

  @IsString()
  @IsNotEmpty()
  year: string;

  @IsString()
  @IsNotEmpty()
  cvc: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class BillingInfoDto {
  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;
}

export class ContactInfoDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  email: string;
}

export class CreateBookingDto {
  @Type(() => ContactInfoDto)
  contactInfo: ContactInfoDto;

  @IsArray()
  @Type(() => TravelerDto)
  travelers: TravelerDto[];

  selectedFlight: any; // Define a specific type if possible

  @Type(() => CardInfoDto)
  cardInfo: CardInfoDto;

  @Type(() => BillingInfoDto)
  billingInfo: BillingInfoDto;
}
