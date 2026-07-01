import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ContactMessage {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field()
  subject!: string;

  @Field()
  message!: string;

  @Field()
  isRead!: boolean;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
