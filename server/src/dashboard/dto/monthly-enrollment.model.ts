import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MonthlyEnrollment {
  @Field()
  month!: string;

  @Field(() => Int)
  totalEnrollments!: number;
}
