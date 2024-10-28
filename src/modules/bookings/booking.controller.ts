import {
    Controller,
    Post,
    Body,
    Get,
    Query,
    Param,
    Patch,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto, PaginateDto } from './booking.dto';
import { Booking, BookingDocument } from 'src/schemas/bookings.schema';
import { BookingGateway } from './booking.gateway'; // Import your BookingGateway
import { Types } from 'mongoose';

@Controller('booking')
export class BookingController {
    constructor(
        private readonly bookingService: BookingService,
        private readonly bookingGateway: BookingGateway // Inject the BookingGateway
    ) { }

    @Post()
    async createBooking(@Body() bookingDetails: CreateBookingDto): Promise<Booking> {
        const newBooking = await this.bookingService.createBooking(bookingDetails);

        // Notify clients about the new booking
        // this.bookingGateway.notifyNewBooking(newBooking as BookingDocument);

        return newBooking; // Return only the new booking object
    }

    @Get('discount')
    async getDiscount(): Promise<any> {
        const discount = await this.bookingService.getBookingDiscount();
        return discount;
    }

    @Get('by-email')
    async getBookingsByContactInfo(
        @Query('email') email: string,
        @Query() paginateDto?: PaginateDto
    ): Promise<Booking[]> {
        return await this.bookingService.getBookingsByEmail(email, paginateDto);
    }

    @Get() // This will be the endpoint for getting all bookings
    async getAllBookings(@Query() paginateDto?: PaginateDto): Promise<Booking[]> {
        return await this.bookingService.getAllBookings(paginateDto);
    }

    @Get(':id')
    async getBookingById(@Param('id') id: string): Promise<Booking> {
        return await this.bookingService.getBookingById(id); // Assuming findById is a method in your service
    }

    // New endpoint to assign an employee to a booking
    @Patch('/assign-employee')
    async assignEmployee(
        @Param('id') bookingId: string,
        @Body('employeeId') employeeId: Types.ObjectId
    ): Promise<Booking> {
        return this.bookingService.assignEmployeeToBooking(bookingId, employeeId);
    }
}
