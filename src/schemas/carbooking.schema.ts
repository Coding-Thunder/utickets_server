import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CarBookingDocument = CarBooking & Document;

@Schema()
export class CarBooking {
  @Prop({ type: Object, required: true })
  contactInfo: {
    phone: string;
    email: string;
  };

  @Prop({ type: Object, required: true })
  selectedCar: {
    id: string;
    vehicle: {
      description: string;
      imageURL?: string;
      seats?: { count: number }[];
      baggages?: { count: number; size: string }[];
    };
    serviceProvider?: {
      name: string;
      logoUrl?: string;
    };
    quotation?: {
      monetaryAmount: number;
      currency?: string;
    };
    extraServices?: { description: string }[];
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

  @Prop({
    type: {
      employee: { type: Types.ObjectId, ref: 'Employee', default: null },
      value: { type: Boolean, default: false },
    },
    required: false,
  })
  status?: {
    employee: Types.ObjectId | null;
    value: boolean;
  };

  @Prop({ unique: true })
  bookingId: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const CarBookingSchema = SchemaFactory.createForClass(CarBooking);
