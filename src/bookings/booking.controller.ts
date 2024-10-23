import {
    Controller,
    Post,
    Body,
    BadRequestException,
    Get,
    Query,
    InternalServerErrorException,
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
}
