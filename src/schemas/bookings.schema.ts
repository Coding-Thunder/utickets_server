import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema()
export class Booking {
  @Prop({ type: Object, required: true })
  contactInfo: {
    phone: string;
    email: string;
  };

  @Prop({
    type: {
      adults: [{
        type: { type: String, required: true },
        firstName: { type: String, required: true },
        middleName: { type: String, required: false },
        lastName: { type: String, required: true },
        gender: { type: String, required: true },
        dob: { type: String, required: true },
      }],
      childrens: [{
        type: { type: String, required: true },
        firstName: { type: String, required: true },
        middleName: { type: String, required: false },
        lastName: { type: String, required: true },
        gender: { type: String, required: true },
        dob: { type: String, required: true },
      }],
      infants: [{
        type: { type: String, required: true },
        firstName: { type: String, required: true },
        middleName: { type: String, required: false },
        lastName: { type: String, required: true },
        gender: { type: String, required: true },
        dob: { type: String, required: true },
      }],
    },
    required: true,
  })
  travelers: {
    adults: Array<{
      type: string;
      firstName: string;
      middleName?: string;
      lastName: string;
      gender: string;
      dob: string;
    }>;
    childrens: Array<{
      type: string;
      firstName: string;
      middleName?: string;
      lastName: string;
      gender: string;
      dob: string;
    }>;
    infants: Array<{
      type: string;
      firstName: string;
      middleName?: string;
      lastName: string;
      gender: string;
      dob: string;
    }>;
  };

  @Prop({ type: Object, required: true })
  selectedFlight: {
    id: string;
    type: string;
    source: string;
    instantTicketingRequired?: boolean;
    nonHomogeneous?: boolean;
    oneWay?: boolean;
    isUpsellOffer?: boolean;
    lastTicketingDate: string;
    lastTicketingDateTime: string;
    numberOfBookableSeats: number;
    itineraries: Array<{
      duration: string;
      segments: Array<{
        departure: {
          iataCode: string;
          terminal: string;
          at: string;
        };
        arrival: {
          iataCode: string;
          terminal: string;
          at: string;
        };
        carrierCode: string;
        number: string;
        aircraft: {
          code: string;
        };
        operating: {
          carrierCode: string;
        };
        duration: string;
        id: string;
        numberOfStops: number;
      }>;
    }>;
    price: {
      currency: string;
      total: string;
      base: string;
      discount?:number
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

  @Prop({
    type: {
      employee: { type: Types.ObjectId, ref: 'Employee', default: null },
      value: { type: Boolean, default: false }
    },
    required: false
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

export const BookingSchema = SchemaFactory.createForClass(Booking);
