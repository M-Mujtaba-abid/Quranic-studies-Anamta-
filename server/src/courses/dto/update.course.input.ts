import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateCourseInput } from './create-course.input';

@InputType()
export class UpdateCourseInput extends PartialType(CreateCourseInput) {
  @Field(() => ID)
  id!: string;
}
