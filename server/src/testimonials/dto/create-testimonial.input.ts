import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { Gender } from '@prisma/client';

@InputType()
export class CreateTestimonialInput {
  @Field()
  @IsNotEmpty({ message: 'Name is required.' })
  @IsString()
  name!: string;

  @Field(() => Gender)
  @IsEnum(Gender, { message: 'Gender must be MALE or FEMALE.' })
  gender!: Gender;

  @Field()
  @IsNotEmpty({ message: 'Country is required.' })
  @IsString()
  country!: string;

  @Field(() => Int)
  @IsInt({ message: 'Rating must be an integer.' })
  @Min(1, { message: 'Rating must be at least 1.' })
  @Max(5, { message: 'Rating cannot be greater than 5.' })
  rating!: number;

  @Field()
  @IsNotEmpty({ message: 'Description is required.' })
  @IsString()
  description!: string;
}
