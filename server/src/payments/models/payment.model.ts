import { Field, Float, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { Enrollment } from '../../enrollments/models/enrollment.model';

registerEnumType(PaymentMethod, {
  name: 'PaymentMethod',
  description: 'Available payment methods',
});

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
  description: 'The status of a submitted payment',
});

@ObjectType()
export class Payment {
  @Field(() => ID)
  id!: string;

  @Field()
  enrollmentId!: string;

  @Field(() => Float)
  amount!: number;

  @Field(() => PaymentMethod)
  paymentMethod!: PaymentMethod;

  @Field({ nullable: true })
  transactionId?: string;

  @Field()
  screenshotUrl!: string;

  @Field()
  screenshotPublicId!: string;

  @Field(() => PaymentStatus)
  status!: PaymentStatus;

  @Field({ nullable: true })
  adminNote?: string;

  @Field({ nullable: true })
  paidAt?: Date;

  @Field(() => Enrollment, { nullable: true })
  enrollment?: Enrollment;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
