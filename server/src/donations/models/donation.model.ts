import { Field, Float, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { DonationType, DonationStatus } from '@prisma/client';

registerEnumType(DonationType, {
  name: 'DonationType',
  description: 'The category of a donation',
});

registerEnumType(DonationStatus, {
  name: 'DonationStatus',
  description: 'The verification status of a submitted donation',
});

@ObjectType()
export class Donation {
  @Field(() => ID)
  id!: string;

  @Field(() => DonationType)
  type!: DonationType;

  @Field({ nullable: true })
  donorName?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Float)
  amount!: number;

  @Field()
  currency!: string;

  @Field()
  screenshotUrl!: string;

  @Field()
  screenshotPublicId!: string;

  @Field(() => DonationStatus)
  status!: DonationStatus;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
