// bookings.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema()
export class Booking {
  @Prop({ required: true })
  contactInfo: {
    phone: string;
    email: string;
  };

  @Prop({ required: true, type: [Object] }) // Specify type for travelers
  travelers: Array<{
    firstName: string;
    middleName?: string;
    lastName: string;
    gender: string; // e.g., "male", "female"
    dob: Date; // Use Date type
  }>;

  @Prop({ required: true, type: Object }) // Specify type for selectedFlight
  selectedFlight: {
    flightNumber: string;
    price: {
      currency: string;
      grandTotal: string;
    };
  };

  @Prop({ required: true, type: Object }) // Specify type for cardInfo
  cardInfo: {
    number: string;
    month: string;
    year: string;
    cvc: string;
    name: string;
  };

  @Prop({ required: true, type: Object }) // Specify type for billingInfo
  billingInfo: {
    country: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
