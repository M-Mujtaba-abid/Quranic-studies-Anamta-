import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { DonationStatus } from '@prisma/client';

@InputType()
export class UpdateDonationStatusInput {
  @Field(() => ID)
  @IsNotEmpty({ message: 'Donation ID is required.' })
  id!: string;

  @Field(() => DonationStatus)
  @IsEnum(DonationStatus, { message: 'Please select a valid donation status.' })
  status!: DonationStatus;
}
