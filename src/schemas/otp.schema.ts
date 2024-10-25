// src/schemas/otp.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OtpDocument = Otp & Document;

@Schema()
export class Otp {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop()
    otp: string;

    @Prop()
    otpExpires: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
