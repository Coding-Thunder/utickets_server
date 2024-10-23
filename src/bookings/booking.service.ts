import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking } from '../schemas/bookings.schema';
import { CreateBookingDto } from './booking.dto';

@Injectable()
export class BookingService {
  constructor(@InjectModel(Booking.name) private bookingModel: Model<Booking>) {}

  async createBooking(bookingDetails: CreateBookingDto): Promise<Booking> {
    try {
      // Check for duplicate booking based on relevant fields (customize as needed)
      const existingBooking = await this.bookingModel.findOne({
        'contactInfo.phone': bookingDetails.contactInfo.phone,
        'contactInfo.email': bookingDetails.contactInfo.email,
        'selectedFlight.id': bookingDetails.selectedFlight.id,
        // Add additional fields to check for duplicates
      });

      if (existingBooking) {
        throw new ConflictException('Booking with the same details already exists.');
      }

      const newBooking = new this.bookingModel(bookingDetails);
      return await newBooking.save();
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error; // Re-throw conflict errors
      }
      // Handle other errors (e.g., database errors)
      throw new InternalServerErrorException('An error occurred while creating the booking.');
    }
  }
}
