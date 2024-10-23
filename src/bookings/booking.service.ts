// booking.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking } from '../schemas/bookings.schema';
import { CreateBookingDto } from './booking.dto';

@Injectable()
export class BookingService {
  constructor(@InjectModel(Booking.name) private bookingModel: Model<Booking>) {}

  async createBooking(bookingDetails: CreateBookingDto): Promise<Booking> {
    const newBooking = new this.bookingModel(bookingDetails);
    return await newBooking.save();
  }
}
