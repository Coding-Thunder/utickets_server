import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema()
export class Booking {
  @Prop({ type: Object, required: true })
  contactInfo: {
    phone: string;
    email: string;
  };

  @Prop({ type: [{ 
    firstName: { type: String, required: true },
    middleName: { type: String, required: false },
    lastName: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: String, required: true } // Consider using Date type for better validation
  }], required: true })
  travelers: Array<{
    firstName: string;
    middleName?: string;
    lastName: string;
    gender: string;
    dob: string;
  }>;

  @Prop({ type: Object, required: true })
  selectedFlight: {
    flightNumber: string;
    price: {
      currency: string;
      grandTotal: string;
    };
  };

  @Prop({ type: Object, required: true })
  cardInfo: {
    number: string;
    month: string;
    year: string;
    cvc: string;
    name: string;
  };

  @Prop({ type: Object, required: true })
  billingInfo: {
    country: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
