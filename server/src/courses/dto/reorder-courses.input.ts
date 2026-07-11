import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CourseSortOrderInput {
  @Field(() => ID)
  @IsNotEmpty({ message: 'Course ID is required.' })
  @IsString()
  id!: string;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  sortOrder!: number;
}

@InputType()
export class ReorderCoursesInput {
  @Field(() => [CourseSortOrderInput])
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one course is required to reorder.' })
  @ValidateNested({ each: true })
  @Type(() => CourseSortOrderInput)
  items!: CourseSortOrderInput[];
}
