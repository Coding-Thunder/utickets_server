import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type HotelBookingDocument = HotelBooking & Document;

@Schema()
export class HotelBooking {
    @Prop({ type: Object, required: true })
    contactInfo: {
        phone: string;
        email: string;
    };

    @Prop({ type: Object, required: true })
    selectedOffer: {
        hotelId: string;
        hotelName: string;
        roomType: string;
        checkInDate: Date;
        checkOutDate: Date;
        guests: {
            adults: number;
            children?: number;
        };
        price: {
            amount: number;
            currency?: string;
        };
        amenities?: string[];
        imageURL?: string;
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

export const HotelBookingSchema = SchemaFactory.createForClass(HotelBooking);
