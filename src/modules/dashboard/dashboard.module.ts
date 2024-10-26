import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Employee, EmployeeSchema } from 'src/schemas/employee.schema';
import { Booking, BookingSchema } from 'src/schemas/bookings.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema }, // Register Employee model
      { name: Booking.name, schema: BookingSchema }, // Register Employee model
    ]),    
  ],
  providers: [DashboardService],
  controllers: [DashboardController]
})
export class DashboardModule {}
