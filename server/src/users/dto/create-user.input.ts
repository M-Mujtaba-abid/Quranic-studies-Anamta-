import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { Role } from '@prisma/client';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  email!: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required.' })
  @Length(6, 100, { message: 'Password must be between 6 and 100 characters.' })
  password!: string;

  @Field()
  @IsNotEmpty({ message: 'First name is required.' })
  @IsString()
  firstName!: string;

  @Field()
  @IsNotEmpty({ message: 'Last name is required.' })
  @IsString()
  lastName!: string;

  @Field(() => Role, { nullable: true })
  @IsOptional()
  role?: Role;
}
