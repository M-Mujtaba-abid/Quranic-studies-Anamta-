import { Field, Float, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

@InputType()
export class CreatePaymentInput {
  @Field()
  @IsNotEmpty({ message: 'Enrollment ID is required.' })
  @IsString()
  enrollmentId!: string;

  @Field(() => Float)
  @IsNumber({}, { message: 'Amount must be a valid number.' })
  @Min(0.01, { message: 'Amount must be greater than 0.' })
  amount!: number;

  @Field(() => PaymentMethod)
  @IsEnum(PaymentMethod, { message: 'Please select a valid payment method.' })
  paymentMethod!: PaymentMethod;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  transactionId?: string;

  @Field()
  @IsNotEmpty({ message: 'Screenshot URL is required.' })
  @IsString()
  screenshotUrl!: string;

  @Field()
  @IsNotEmpty({ message: 'Screenshot Public ID is required.' })
  @IsString()
  screenshotPublicId!: string;
}
