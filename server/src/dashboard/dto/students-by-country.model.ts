import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StudentsByCountry {
  @Field()
  country!: string;

  @Field(() => Int)
  totalStudents!: number;
}
