// booking.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking } from '../schemas/bookings.schema';
import { CreateBookingDto } from './booking.dto';

@Injectable()
export class BookingService {
  constructor(@InjectModel(Booking.name) private bookingModel: Model<Booking>) {}

  async createBooking(bookingDetails: CreateBookingDto): Promise<Booking> {
    try {
      const newBooking = new this.bookingModel(bookingDetails);
      return await newBooking.save();
    } catch (error) {
      // You can log the error for debugging purposes
      throw new InternalServerErrorException('Error saving booking data');
    }
  }
}
