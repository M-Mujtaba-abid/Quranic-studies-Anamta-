import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Role } from '@prisma/client';

registerEnumType(Role, {
  name: 'Role',
  description: 'User roles for authentication and authorization',
});

@ObjectType()
export class User {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field(() => Role)
  role!: Role;

  @Field({ nullable: true })
  resetToken?: string;

  @Field({ nullable: true })
  resetTokenExpiry?: Date;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
