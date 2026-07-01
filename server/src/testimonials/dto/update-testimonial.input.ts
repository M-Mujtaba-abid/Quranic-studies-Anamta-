import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateTestimonialInput } from './create-testimonial.input';
import { TestimonialStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

@InputType()
export class UpdateTestimonialInput extends PartialType(CreateTestimonialInput) {
  @Field(() => ID)
  id!: string;

  @Field(() => TestimonialStatus, { nullable: true })
  @IsOptional()
  @IsEnum(TestimonialStatus)
  status?: TestimonialStatus;
}
