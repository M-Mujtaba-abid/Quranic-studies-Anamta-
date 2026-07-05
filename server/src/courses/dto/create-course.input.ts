import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, Length, IsString, IsArray, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCoursePackageInput } from './create-course-package.input';

@InputType()
export class CreateCourseInput {
  @Field()
  @IsNotEmpty({ message: 'Image URL is required.' })
  @IsString()
  imageUrl!: string;

  @Field()
  @IsNotEmpty({ message: 'Image ID is required.' })
  @IsString()
  imageId!: string;

  @Field()
  @IsNotEmpty({ message: 'Course title is required.' })
  @Length(3, 100)
  title!: string;

  @Field()
  @IsNotEmpty({ message: 'Description is required.' })
  description!: string;

  @Field(() => [CreateCoursePackageInput])
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one regional package is required.' })
  @ValidateNested({ each: true })
  @Type(() => CreateCoursePackageInput)
  packages!: CreateCoursePackageInput[];
}
