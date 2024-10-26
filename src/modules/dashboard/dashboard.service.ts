import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Employee, EmployeeDocument } from 'src/schemas/employee.schema';
import { Booking, BookingDocument } from 'src/schemas/bookings.schema';
import { DashboardDataDto } from './dashboard.dto';

@Injectable()
export class DashboardService {
    constructor(
        @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
        @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>, 
    ) {}

    async getDashboardData(): Promise<DashboardDataDto> {
        try {
            const [totalEmployees, adminsCount, viewerCount, totalBookings, pendingBookings, completedBookings] = await Promise.all([
                this.employeeModel.countDocuments().exec(),
                this.employeeModel.countDocuments({ role: 'admin' }).exec(),
                this.employeeModel.countDocuments({ role: 'viewer' }).exec(),
                this.bookingModel.countDocuments().exec(),
                this.bookingModel.countDocuments({ 'status.value': false }).exec(), // Pending bookings
                this.bookingModel.countDocuments({ 'status.value': true }).exec(),  // Completed bookings
            ]);
            return {
                totalEmployees, // Renamed to match DashboardDataDto
                adminsCount,                     // Renamed to match DashboardDataDto
                viewerCount,                    // Remains the same
                totalBookings,    // Renamed to match DashboardDataDto
                pendingBookings,                // Added pending bookings count
                completedBookings               // Added completed bookings count
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve dashboard data. ' + error.message);
        }
    }

    async getRecentBookings(): Promise<BookingDocument[]> {
        try {
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); // Calculate the date for 24 hours ago
            return await this.bookingModel.find({ createdAt: { $gte: twentyFourHoursAgo } }).exec(); // Fetch bookings created in the last 24 hours
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve recent bookings. ' + error.message);
        }
    }
}
