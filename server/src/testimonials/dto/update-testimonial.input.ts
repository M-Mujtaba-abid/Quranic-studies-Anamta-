import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateTestimonialInput } from './create-testimonial.input';
import { TestimonialStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UpdateTestimonialInput extends PartialType(CreateTestimonialInput) {
  @Field(() => ID)
  @IsNotEmpty({ message: 'Testimonial ID is required.' })
  @IsString()
  id!: string;

  @Field(() => TestimonialStatus, { nullable: true })
  @IsOptional()
  @IsEnum(TestimonialStatus)
  status?: TestimonialStatus;
}
