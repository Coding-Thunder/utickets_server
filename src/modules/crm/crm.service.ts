import {
    Injectable,
    NotFoundException,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee, EmployeeDocument } from '../../schemas/employee.schema';
import { CreateEmployeeDto } from './crm.dto';
import { randomBytes } from 'crypto';
import { Otp, OtpDocument } from '../../schemas/otp.schema';
import { sendOtpEmail } from 'src/utils/emails';

@Injectable()
export class CrmService {
    constructor(
        @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
        @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
    ) {}

    async addEmployee(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
        try {
            const employeeCount = await this.employeeModel.countDocuments().exec();
            const newEmployeeCode = `EMP${employeeCount + 1}`; // Generate the employee code
            const newEmployee = new this.employeeModel({
                ...createEmployeeDto,
                code: newEmployeeCode,
            });
            return await newEmployee.save();
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to add employee. ' + error.message,
            );
        }
    }

    async getEmployees(): Promise<Employee[]> {
        try {
            return await this.employeeModel.find().exec();
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to retrieve employees. ' + error.message,
            );
        }
    }

    async sendOtp(email: string): Promise<void> {
        try {
            // Check if the employee exists
            const employee = await this.employeeModel.findOne({ email });

            if (!employee) {
                throw new NotFoundException('Employee does not exist.');
            }

            const otp = randomBytes(3).toString('hex'); // Generate a simple OTP
            const expires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

            await this.otpModel.findOneAndUpdate(
                { email },
                { otp, otpExpires: expires },
                { upsert: true },
            );

            await sendOtpEmail(email, otp, employee.code); // Send OTP via email (or SMS)
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to send OTP. ' + error.message,
            );
        }
    }

    async verifyOtp(email: string, otp: string): Promise<Employee> {
        try {
            const otpEntry = await this.otpModel.findOne({ email });

            if (!otpEntry) {
                throw new BadRequestException('OTP entry not found for this email.');
            }

            if (otpEntry.otp !== otp) {
                throw new BadRequestException('Invalid OTP provided.');
            }

            if (otpEntry.otpExpires < new Date()) {
                throw new BadRequestException('OTP has expired.');
            }

            // OTP is valid, find the employee
            const employee = await this.employeeModel.findOne({ email }).exec();

            if (!employee) {
                throw new NotFoundException('Employee not found.');
            }

            return employee; // Return employee details
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to verify OTP. ' + error.message,
            );
        }
    }
}
