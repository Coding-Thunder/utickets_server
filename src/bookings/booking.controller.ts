import {
    Controller,
    Post,
    Body,
    BadRequestException,
    Get,
    Query,
    InternalServerErrorException,
    Param,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { Booking } from '../schemas/bookings.schema';
import { CreateBookingDto, PaginateDto } from './booking.dto';

@Controller('booking')
export class BookingController {
    constructor(private readonly bookingService: BookingService) { }

    @Post()
    async createBooking(@Body() bookingDetails: CreateBookingDto): Promise<Booking> {
        try {
            return await this.bookingService.createBooking(bookingDetails);
        } catch (error) {
            throw new BadRequestException('Failed to create booking');
        }
    }

    @Get('by-email')
    async getBookingsByContactInfo(
        @Query('email') email: string,
        @Query() paginateDto?: PaginateDto
    ): Promise<Booking[]> {
        if (!email) {
            throw new BadRequestException('Phone and email are required.');
        }
        try {
            return await this.bookingService.getBookingsByEmail(email, paginateDto);
        } catch (error) {
            throw new InternalServerErrorException('An error occurred while fetching bookings.');
        }
    }

    @Get() // This will be the endpoint for getting all bookings
    async getAllBookings(@Query() paginateDto: PaginateDto): Promise<Booking[]> {
        return this.bookingService.getAllBookings(paginateDto);
    }

    @Get(':id')
    async getBookingById(@Param('id') id: string): Promise<Booking> {
      return this.bookingService.getBookingById(id); // Assuming findById is a method in your service
    }
}
