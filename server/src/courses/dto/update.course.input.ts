import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateCourseInput } from './create-course.input';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

@InputType()
export class UpdateCourseInput extends PartialType(CreateCourseInput) {
  @Field(() => ID)
  @IsNotEmpty({ message: 'Course ID is required.' })
  @IsString()
  id!: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
