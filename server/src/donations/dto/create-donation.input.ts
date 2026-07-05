import { Field, Float, InputType } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { DonationType } from '@prisma/client';

@InputType()
export class CreateDonationInput {
  @Field(() => DonationType)
  @IsEnum(DonationType, { message: 'Please select a valid donation type.' })
  type!: DonationType;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  donorName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Float)
  @IsNumber({}, { message: 'Amount must be a valid number.' })
  @Min(1, { message: 'Amount must be greater than 0.' })
  amount!: number;

  @Field()
  @IsNotEmpty({ message: 'Currency is required.' })
  @IsString()
  currency!: string;

  @Field()
  @IsNotEmpty({ message: 'Screenshot URL is required.' })
  @IsString()
  screenshotUrl!: string;

  @Field()
  @IsNotEmpty({ message: 'Screenshot Public ID is required.' })
  @IsString()
  screenshotPublicId!: string;
}
