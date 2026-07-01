import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

@InputType()
export class CreateContactMessageInput {
  @Field()
  @IsNotEmpty({ message: 'Name is required.' })
  @IsString()
  @Length(2, 100, { message: 'Name must be between 2 and 100 characters.' })
  name!: string;

  @Field()
  @IsNotEmpty({ message: 'Email address is required.' })
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  email!: string;

  @Field()
  @IsNotEmpty({ message: 'Subject is required.' })
  @IsString()
  @Length(3, 150, { message: 'Subject must be between 3 and 150 characters.' })
  subject!: string;

  @Field()
  @IsNotEmpty({ message: 'Message is required.' })
  @IsString()
  @Length(10, 2000, { message: 'Message must be between 10 and 2000 characters.' })
  message!: string;
}
