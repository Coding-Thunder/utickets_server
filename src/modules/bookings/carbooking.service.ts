import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CarBooking, CarBookingDocument } from 'src/schemas/carbooking.schema';
import { sendCarBookingMail } from 'src/utils/emails';

@Injectable()
export class CarBookingService {
    constructor(
        @InjectModel(CarBooking.name) private carBookingModel: Model<CarBookingDocument>,
    ) { }

    //
    async createCarBooking(bookingDetails: any): Promise<CarBooking> {
        try {
            // Generate a unique booking ID for each new booking
            // Fetch the last created booking to get the latest bookingId
            const lastBooking = await this.carBookingModel.findOne().sort({ bookingId: -1 }).exec();

            // Generate the new bookingId based on the last one
            const newIdNumber = lastBooking ? parseInt(lastBooking.bookingId.replace('BTCAR', '')) + 1 : 1; const status = { employee: null, value: false };
            const newBookingId = `BTCAR${newIdNumber}`;
            const newBooking = new this.carBookingModel({
                ...bookingDetails,
                bookingId: newBookingId,
                status,
            });

            await newBooking.save();
            // Send car booking confirmation email
            // if (bookingDetails.contactInfo?.email && bookingDetails.selectedCar) {
            //     await sendCarBookingMail(
            //         newBookingId,
            //         bookingDetails.contactInfo.email,
            //         bookingDetails.selectedCar,
            //         bookingDetails.searchCriteria
            //     );
            // }
            return newBooking;
        } catch (error) {
            // console.error('Error creating car booking:', error);
            throw new InternalServerErrorException('Failed to create booking');
        }
    }

    // Get car bookings by email
    async getBookingsByEmail(email: string, skip = 0, limit = 10): Promise<CarBooking[]> {
        try {
            return this.carBookingModel.find({ 'contactInfo.email': email })
                .skip(skip)
                .limit(limit)
                .exec();
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch bookings');
        }
    }

    // Get car booking by ID
    async getBookingById(id: string): Promise<CarBooking> {
        try {
            const booking = await this.carBookingModel.findById(id).exec();
            if (!booking) throw new NotFoundException(`Booking with ID ${id} not found`);
            return booking;
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch booking');
        }
    }

    // Assign employee to booking
    async assignEmployeeToBooking(bookingId: string, employeeId: Types.ObjectId): Promise<CarBooking> {
        try {
            const booking = await this.carBookingModel.findById(bookingId).exec();
            if (!booking) throw new NotFoundException(`Booking with ID ${bookingId} not found`);

            booking.status.employee = employeeId;
            booking.status.value = true;
            await booking.save();

            return booking;
        } catch (error) {
            throw new InternalServerErrorException('Failed to assign employee to booking');
        }
    }
}
