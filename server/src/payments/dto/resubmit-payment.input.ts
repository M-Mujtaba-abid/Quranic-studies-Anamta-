import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class ResubmitPaymentInput {
  @Field()
  @IsNotEmpty({ message: 'Enrollment ID is required.' })
  @IsString()
  enrollmentId!: string;

  @Field()
  @IsNotEmpty({ message: 'Screenshot URL is required.' })
  @IsString()
  screenshotUrl!: string;

  @Field()
  @IsNotEmpty({ message: 'Screenshot Public ID is required.' })
  @IsString()
  screenshotPublicId!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  transactionId?: string;
}
