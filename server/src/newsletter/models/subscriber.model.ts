import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Subscriber {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;

  @Field()
  isActive!: boolean;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
