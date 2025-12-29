import {
    Controller,
    Post,
    Body,
    Get,
    Query,
    Param,
    Patch,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto, PaginateDto } from './booking.dto';
import { Booking } from 'src/schemas/bookings.schema';
import { Types } from 'mongoose';
import { CarBookingService } from './carbooking.service';
import { HotelBookingService } from './hotel.service';

@Controller('booking')
export class BookingController {
    constructor(
        private readonly bookingService: BookingService,
        private readonly carBookiingService: CarBookingService,  // Inject the BookingGateway
        private readonly hotelBookiingService: HotelBookingService // Inject the BookingGateway
    ) { }

    @Post()
    async createBooking(@Body() bookingDetails: CreateBookingDto): Promise<Booking> {
        const newBooking = await this.bookingService.createBooking(bookingDetails);

        // Notify clients about the new booking
        // this.bookingGateway.notifyNewBooking(newBooking as BookingDocument);

        return newBooking; // Return only the new booking object
    }

    @Post('hotel')
    async bookHotel(@Body() bookingDetails: any) {
        if (!bookingDetails.contactInfo || !bookingDetails.selectedOffer || !bookingDetails.cardInfo || !bookingDetails.billingInfo) {
            throw new HttpException('Missing required hotel booking details', HttpStatus.BAD_REQUEST);
        }
        try {
            const booking = await this.hotelBookiingService.createBooking(bookingDetails);
            return { message: 'Hotel booking created successfully', booking };
        } catch (error) {
            throw new HttpException('Failed to create hotel booking', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('car')
    async bookCar(@Body() bookingDetails: any) {
        // Basic validation
        if (!bookingDetails.contactInfo || !bookingDetails.selectedCar || !bookingDetails.cardInfo || !bookingDetails.billingInfo) {
            throw new HttpException('Missing required booking details', HttpStatus.BAD_REQUEST);
        }

        try {
            const booking = await this.carBookiingService.createCarBooking(bookingDetails);
            return {
                message: 'Car booking created successfully',
                booking,
            };
        } catch (error) {
            throw new HttpException('Failed to create booking', HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
    ): Promise<Record<string, any>> {
        return this.bookingService.getBookingsByEmail(email, paginateDto);
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

    // @Get("/test-email")
    // async testEmail(): Promise<any> {
    //     return await this.bookingService.testMail()
    // }
}
