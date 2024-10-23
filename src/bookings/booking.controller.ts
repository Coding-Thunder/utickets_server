// booking.controller.ts
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { BookingService } from './booking.service';
import { Booking } from '../schemas/bookings.schema';
import { CreateBookingDto } from './booking.dto';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async createBooking(@Body() bookingDetails: CreateBookingDto): Promise<Booking> {
    try {
      return await this.bookingService.createBooking(bookingDetails);
    } catch (error) {
      // You can customize the error handling based on your needs
      throw new BadRequestException('Failed to create booking');
    }
  }
}
