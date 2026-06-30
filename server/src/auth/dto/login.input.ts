import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  email!: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required.' })
  @Length(6, 100, { message: 'Password must be between 6 and 100 characters.' })
  password!: string;
}
