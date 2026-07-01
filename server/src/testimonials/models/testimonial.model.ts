import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Gender, TestimonialStatus } from '@prisma/client';

registerEnumType(Gender, {
  name: 'Gender',
  description: 'Gender options',
});

registerEnumType(TestimonialStatus, {
  name: 'TestimonialStatus',
  description: 'Testimonial review status',
});

@ObjectType()
export class Testimonial {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => Gender)
  gender!: Gender;

  @Field()
  country!: string;

  @Field()
  rating!: number;

  @Field()
  description!: string;

  @Field(() => TestimonialStatus)
  status!: TestimonialStatus;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@ObjectType()
export class SubmitTestimonialResponse {
  @Field()
  message!: string;

  @Field(() => Testimonial)
  testimonial!: Testimonial;
}
