import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/models/user.model';

@ObjectType()
export class LoginResponse {
  @Field()
  token!: string;

  @Field(() => User)
  user!: User;
}
