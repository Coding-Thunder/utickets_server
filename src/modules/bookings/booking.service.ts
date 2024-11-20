import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { Booking } from '../../schemas/bookings.schema';
import { CreateBookingDto, PaginateDto } from './booking.dto';
import { sentTransactionalMail } from 'src/utils/emails';

@Injectable()
export class BookingService {
    constructor(@InjectModel(Booking.name) private bookingModel: Model<Booking>) { }

    async createBooking(bookingDetails: CreateBookingDto): Promise<Booking> {
        try {
            // Fetch the last created booking to get the latest bookingId
            const lastBooking = await this.bookingModel.findOne().sort({ bookingId: -1 }).exec();
    
            // Generate the new bookingId based on the last one
            const newIdNumber = lastBooking ? parseInt(lastBooking.bookingId.replace('UTK', '')) + 1 : 1;
            const newBookingId = `UTK${newIdNumber}`;
    
            // Set default status values
            const status = {
                employee: null, // No employee assigned by default
                value: false, // Booking not picked by a salesperson
            };
    
            // Create the new booking with generated bookingId and default status
            const newBooking = new this.bookingModel({
                ...bookingDetails,
                bookingId: newBookingId,
                status, // Set the default status
            });
    
            await newBooking.save();
            // Send a transactional email with booking confirmation
            try {
                await sentTransactionalMail(newBooking.bookingId, newBooking.contactInfo.email);
            } catch (emailError) {
                console.error('Failed to send booking confirmation email:', emailError);
                // Optionally, handle email failure (e.g., retry, notify admin)
            }
    
            return newBooking;
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

    // New method to fetch all bookings with pagination
    async getAllBookings(paginateDto: PaginateDto): Promise<Booking[]> {
        try {
            const bookings = await this.bookingModel.find()
                .skip(paginateDto?.skip || 0)
                .limit(paginateDto?.limit || 10);
            return bookings;
        } catch (error) {
            throw new InternalServerErrorException('An error occurred while fetching all bookings.');
        }
    }

    // New method to fetch a booking by ID
    async getBookingById(id: string): Promise<Booking> {
        try {
            const booking = await this.bookingModel.findById(id).exec();
            if (!booking) {
                throw new NotFoundException(`Booking with ID ${id} not found`);
            }
            return booking;
        } catch (error) {
            throw new InternalServerErrorException('An error occurred while fetching the booking.');
        }
    }

    async assignEmployeeToBooking(bookingId: string, employeeId: Types.ObjectId): Promise<Booking> {
        try {
            // Find the booking by ID
            const booking = await this.bookingModel.findById(bookingId).exec();
            if (!booking) {
                throw new NotFoundException(`Booking with ID ${bookingId} not found`);
            }
    
            // Update the booking's status to assign the employee
            booking.status.employee = employeeId; // Set the employee ID
            booking.status.value = true; // Optionally set the value to true if required
            await booking.save(); // Save the updated booking
    
            return booking; // Return the updated booking
        } catch (error) {
            throw new InternalServerErrorException('An error occurred while assigning the employee to the booking.');
        }
    }
    async getBookingDiscount(): Promise<any> {
        try {
            // Replace this with your actual logic to fetch the discount
            // For example, you might fetch from a database or an external API
            const discount = await this.fetchDiscountFromDatabase(); // Example method
            return {discount};
        } catch (error) {
            // Log the error for debugging (optional)
            console.error('Error fetching booking discount:', error);

            // Throw an exception to inform the caller of the failure
            throw new InternalServerErrorException('Failed to retrieve booking discount');
        }
    }

    private async fetchDiscountFromDatabase(): Promise<number> {
        // Simulate fetching the discount. Replace with actual implementation.
        return 15; 
    }
}
