import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class Course {
  @Field(() => ID)
  id!: string;

  @Field()
  imageUrl!: string;

  @Field()
  imageId!: string;

  @Field()
  title!: string;

  @Field()
  description!: string;

  @Field()
  duration!: string;

  @Field()
  days!: string;

  @Field(() => Float)
  price!: number;

  @Field()
  isActive!: boolean;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
