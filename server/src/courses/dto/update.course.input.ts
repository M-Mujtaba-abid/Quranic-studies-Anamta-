import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateCourseInput } from './create-course.input';
import { CreateCoursePackageInput } from './create-course-package.input';

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

  // Re-declare so nested package fields (e.g. description) survive PartialType + ValidationPipe.
  @Field(() => [CreateCoursePackageInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCoursePackageInput)
  packages?: CreateCoursePackageInput[];
}
