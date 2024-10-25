// crm/crm.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CrmController } from './crm.controller';
import { CrmService } from './crm.service';
import { Employee, EmployeeSchema } from '../../schemas/employee.schema';
import { Otp, OtpSchema } from 'src/schemas/otp.schema';

@Module({
    imports: [
      MongooseModule.forFeature([
        { name: Employee.name, schema: EmployeeSchema }, // Register Employee model
        { name: Otp.name, schema: OtpSchema }, // Register Otp model
      ]),    ],
    controllers: [CrmController],
    providers: [CrmService],
})
export class CrmModule {}
