import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardDataDto } from './dashboard.dto';
import { BookingDocument } from 'src/schemas/bookings.schema';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get('data')
    async getDashboardData(): Promise<DashboardDataDto> {
        return this.dashboardService.getDashboardData();
    }

    @Get('recent-bookings')
    async getRecentBookings(): Promise<BookingDocument[]> {
        return this.dashboardService.getRecentBookings();
    }
}
