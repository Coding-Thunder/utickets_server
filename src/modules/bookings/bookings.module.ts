import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from '../../schemas/bookings.schema'; // Adjust the path as needed
import { BookingController } from './booking.controller'; // Adjust the path as needed
import { BookingService } from './booking.service'; // Adjust the path as needed

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
