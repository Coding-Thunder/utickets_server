import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from '../../schemas/bookings.schema'; // Adjust the path as needed
import { BookingController } from './booking.controller'; // Adjust the path as needed
import { BookingService } from './booking.service'; // Adjust the path as needed
import { BookingGateway } from './booking.gateway';
import { CarBookingService } from './carbooking.service';
import { CarBooking, CarBookingSchema } from 'src/schemas/carbooking.schema';
import { HotelBooking, HotelBookingSchema } from 'src/schemas/hotel.schema';
import { HotelBookingService } from './hotel.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }, { name: CarBooking.name, schema: CarBookingSchema }, { name: HotelBooking.name, schema: HotelBookingSchema }]),
  ],
  controllers: [BookingController],
  providers: [BookingService, BookingGateway, CarBookingService, HotelBookingService],
})
export class BookingModule { }
