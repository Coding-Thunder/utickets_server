import { IsEmail, IsNotEmpty, IsString, IsArray, IsOptional, IsDateString, ValidateNested, IsInt, Min, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

class ContactInfo {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

class Traveler {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsOptional()
  @IsString()
  middleName?: string | null; // Allowing for null

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsDateString()
  dob: string;
}

class Price {
  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  total: string;

  @IsString()
  @IsNotEmpty()
  base: string;
}

class Aircraft {
  @IsString()
  @IsNotEmpty()
  code: string;
}

class Operating {
  @IsString()
  @IsNotEmpty()
  carrierCode: string;
}

class Departure {
  @IsString()
  @IsNotEmpty()
  iataCode: string;

  @IsString()
  @IsNotEmpty()
  terminal: string;

  @IsString()
  @IsNotEmpty()
  at: string;
}

class Arrival {
  @IsString()
  @IsNotEmpty()
  iataCode: string;

  @IsString()
  @IsNotEmpty()
  terminal: string;

  @IsString()
  @IsNotEmpty()
  at: string;
}

class Segment {
  @ValidateNested()
  @Type(() => Departure)
  departure: Departure;

  @ValidateNested()
  @Type(() => Arrival)
  arrival: Arrival;

  @IsString()
  @IsNotEmpty()
  carrierCode: string;

  @IsString()
  @IsNotEmpty()
  number: string;

  @ValidateNested()
  @Type(() => Aircraft)
  aircraft: Aircraft;

  @ValidateNested()
  @Type(() => Operating)
  operating: Operating;

  @IsString()
  @IsNotEmpty()
  duration: string;

  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @IsInt() // Ensure it's an integer
  @Min(0) // Ensure non-negative
  numberOfStops: number;
}

class Itinerary {
  @IsString()
  @IsNotEmpty()
  duration: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Segment)
  segments: Segment[];
}

class SelectedFlight {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  source: string;

  @IsOptional()
  instantTicketingRequired?: boolean;

  @IsOptional()
  nonHomogeneous?: boolean;

  @IsOptional()
  oneWay?: boolean;

  @IsOptional()
  isUpsellOffer?: boolean;

  @IsString()
  @IsNotEmpty()
  lastTicketingDate: string;

  @IsString()
  @IsNotEmpty()
  lastTicketingDateTime: string;

  @IsNotEmpty()
  @IsInt() // Ensure it's an integer
  @Min(0) // Ensure non-negative
  numberOfBookableSeats: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Itinerary)
  itineraries: Itinerary[];

  @ValidateNested()
  @Type(() => Price)
  price: Price;

  // Additional fields for selected flight
  @IsOptional()
  @IsString()
  notes?: string; // Optional notes for the flight
}

class CardInfo {
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

class BillingInfo {
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

  @IsOptional()
  @IsString()
  additionalNotes?: string; // Optional additional notes for billing
}

class TravelerDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Traveler)
  adults: Traveler[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Traveler)
  childrens: Traveler[]; // Updated field name

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Traveler)
  infants: Traveler[];
}

export class CreateBookingDto {
  @ValidateNested()
  @Type(() => ContactInfo)
  contactInfo: ContactInfo;

  @ValidateNested() // Ensure validation for the TravelerDTO
  @Type(() => TravelerDTO)
  travelers: TravelerDTO;

  @ValidateNested()
  @Type(() => SelectedFlight)
  selectedFlight: SelectedFlight;

  @ValidateNested()
  @Type(() => CardInfo)
  cardInfo: CardInfo;

  @ValidateNested()
  @Type(() => BillingInfo)
  billingInfo: BillingInfo;

  // Additional fields for the booking details
  @IsOptional()
  @IsBoolean()
  isConfirmed?: boolean; // Optional confirmation flag for the booking

  @IsOptional()
  @IsString()
  bookingReference?: string; // Optional booking reference
}

export class PaginateDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  skip?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}
