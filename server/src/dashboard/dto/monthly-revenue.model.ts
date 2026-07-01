import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MonthlyRevenue {
  @Field()
  month!: string;

  @Field(() => Float)
  totalRevenue!: number;
}
