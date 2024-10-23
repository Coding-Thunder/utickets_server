import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Booking extends Document {
  @Prop({ required: true })
  contactInfo: { phone: string; email: string };

  @Prop({ 
    type: [
      {
        firstName: { type: String, required: true },
        middleName: { type: String },
        lastName: { type: String, required: true },
        gender: { type: String, required: true },
        dob: { type: String, required: true }, // You might want to use a Date type if appropriate
      }
    ],
    required: true 
  })
  travelers: {
    firstName: string;
    middleName?: string;
    lastName: string;
    gender: string;
    dob: string;
  }[];

  @Prop({ required: true })
  selectedFlight: any; // Adjust this type as necessary

  @Prop({ required: true })
  cardInfo: { number: string; month: string; year: string; cvc: string; name: string };

  @Prop({ required: true })
  billingInfo: {
    country: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
