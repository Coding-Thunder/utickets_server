// create-booking.dto.ts
import { IsEmail, IsNotEmpty, IsString, IsArray, IsObject, IsOptional, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ContactInfo {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class Traveler {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsDateString() // Use Date format for validation
  dob: string;
}

export class Price {
  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  grandTotal: string;
}

export class SelectedFlight {
  @IsString()
  @IsNotEmpty()
  flightNumber: string;

  @ValidateNested()
  @Type(() => Price)
  @IsNotEmpty()
  price: Price;
}

export class CardInfo {
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

export class BillingInfo {
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

export class CreateBookingDto {
  @ValidateNested()
  @Type(() => ContactInfo)
  @IsNotEmpty()
  contactInfo: ContactInfo;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Traveler)
  @IsNotEmpty()
  travelers: Traveler[];

  @ValidateNested()
  @Type(() => SelectedFlight)
  @IsNotEmpty()
  selectedFlight: SelectedFlight;

  @ValidateNested()
  @Type(() => CardInfo)
  @IsNotEmpty()
  cardInfo: CardInfo;

  @ValidateNested()
  @Type(() => BillingInfo)
  @IsNotEmpty()
  billingInfo: BillingInfo;
}
