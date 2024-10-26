// src/modules/crm/crm.controller.ts
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CrmService } from './crm.service';
import { Employee } from '../../schemas/employee.schema';
import { CreateEmployeeDto, SendOtpDto, VerifyOtpDto } from './crm.dto';

@Controller('crm')
export class CrmController {
    constructor(private readonly crmService: CrmService) { }

    @Post('employees')
    async createEmployee(@Body() createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
        return this.crmService.addEmployee(createEmployeeDto);
    }

    @Get('employees')
    async getEmployees(): Promise<Employee[]> {
        return this.crmService.getEmployees();
    }

    @Post('otp/send') // Endpoint to send OTP
    async sendOtp(@Body() sendOtpDto: SendOtpDto): Promise<{ message: string }> {
        await this.crmService.sendOtp(sendOtpDto.email);
        return { message: 'OTP sent successfully.' };
    }

    @Post('otp/verify') // Endpoint to verify OTP
    async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<{ valid: boolean | Employee }> {
        const valid = await this.crmService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
        return { valid };
    }

}
