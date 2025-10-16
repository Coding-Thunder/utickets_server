import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HotelBooking, HotelBookingDocument } from 'src/schemas/hotel.schema';
import { PaginateDto } from './booking.dto';
import { sendHotelBookingMail } from 'src/utils/emails';


@Injectable()
export class HotelBookingService {
    constructor(
        @InjectModel(HotelBooking.name) private hotelBookingModel: Model<HotelBookingDocument>
    ) { }

    // Create a new hotel booking
    async createBooking(bookingDetails: any): Promise<HotelBooking> {
        try {
            // Fetch the last created booking to generate new bookingId
            const lastBooking = await this.hotelBookingModel.findOne().sort({ bookingId: -1 }).exec();
            const newIdNumber = lastBooking ? parseInt(lastBooking.bookingId.replace('BTHTL', '')) + 1 : 1;
            const newBookingId = `BTHTL${newIdNumber}`;

            const status = {
                employee: null,
                value: false,
            };

            const newBooking = new this.hotelBookingModel({
                ...bookingDetails,
                bookingId: newBookingId,
                status,
            });


              if (bookingDetails.contactInfo?.email && bookingDetails.selectedOffer) {
                            await sendHotelBookingMail({newBookingId, ...bookingDetails});
                        }
            await newBooking.save();

            // Optional: send email confirmation here

            return newBooking;
        } catch (error) {
            // console.error(error);
            throw new InternalServerErrorException('An error occurred while creating the hotel booking.');
        }
    }

    // Fetch hotel bookings by customer email with pagination
    async getBookingsByEmail(email: string, paginateDto?: PaginateDto): Promise<HotelBooking[]> {
        try {
            const query = { 'contactInfo.email': email };
            const bookings = await this.hotelBookingModel.find(query)
                .skip(paginateDto?.skip || 0)
                .limit(paginateDto?.limit || 10)
                .exec();
            return bookings;
        } catch (error) {
            // console.error(error);
            throw new InternalServerErrorException('An error occurred while fetching hotel bookings.');
        }
    }

    // Fetch all hotel bookings with pagination
    async getAllBookings(paginateDto: PaginateDto): Promise<HotelBooking[]> {
        try {
            const bookings = await this.hotelBookingModel.find()
                .skip(paginateDto?.skip || 0)
                .limit(paginateDto?.limit || 10)
                .exec();
            return bookings;
        } catch (error) {
            // console.error(error);
            throw new InternalServerErrorException('An error occurred while fetching all hotel bookings.');
        }
    }

    // Fetch a booking by its ID
    async getBookingById(id: string): Promise<HotelBooking> {
        try {
            const booking = await this.hotelBookingModel.findById(id).exec();
            if (!booking) throw new NotFoundException(`Hotel booking with ID ${id} not found`);
            return booking;
        } catch (error) {
            // console.error(error);
            throw new InternalServerErrorException('An error occurred while fetching the hotel booking.');
        }
    }

    // Assign an employee to a hotel booking
    async assignEmployeeToBooking(bookingId: string, employeeId: Types.ObjectId): Promise<HotelBooking> {
        try {
            const booking = await this.hotelBookingModel.findById(bookingId).exec();
            if (!booking) throw new NotFoundException(`Hotel booking with ID ${bookingId} not found`);

            booking.status.employee = employeeId;
            booking.status.value = true;
            await booking.save();

            return booking;
        } catch (error) {
            // console.error(error);
            throw new InternalServerErrorException('An error occurred while assigning the employee to the hotel booking.');
        }
    }

    // Example: fetch hotel booking discount
    async getBookingDiscount(): Promise<any> {
        try {
            const discount = await this.fetchDiscountFromDatabase();
            return { discount };
        } catch (error) {
            // console.error('Error fetching hotel booking discount:', error);
            throw new InternalServerErrorException('Failed to retrieve hotel booking discount');
        }
    }

    private async fetchDiscountFromDatabase(): Promise<number> {
        // Simulate fetching the discount; replace with actual DB logic
        return 0;
    }
}
