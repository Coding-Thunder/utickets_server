import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking } from '../schemas/bookings.schema';
import { CreateBookingDto, PaginateDto } from './booking.dto';

@Injectable()
export class BookingService {
    constructor(@InjectModel(Booking.name) private bookingModel: Model<Booking>) { }

    async createBooking(bookingDetails: CreateBookingDto): Promise<Booking> {
        try {
            const newBooking = new this.bookingModel(bookingDetails);
            return await newBooking.save();
        } catch (error) {
            throw new InternalServerErrorException('An error occurred while creating the booking.');
        }
    }

    async getBookingsByEmail(email: string, paginateDto?: PaginateDto): Promise<Booking[]> {
        try {
            const query = { 'contactInfo.email': email };
            const bookings = await this.bookingModel.find(query)
                .skip(paginateDto?.skip || 0)
                .limit(paginateDto?.limit || 10);
            return bookings;
        } catch (error) {
            throw new InternalServerErrorException('An error occurred while fetching bookings.');
        }
    }
    
}
