// schemas/employee.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmployeeDocument = Employee & Document;

@Schema()
export class Employee {
    @Prop({ required: true, unique: true })
    code: string; // Custom employee code (e.g., EMP1, EMP2)

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    role: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
