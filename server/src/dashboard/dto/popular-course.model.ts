import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PopularCourse {
  @Field()
  courseId!: string;

  @Field()
  courseTitle!: string;

  @Field(() => Int)
  totalEnrollments!: number;
}
