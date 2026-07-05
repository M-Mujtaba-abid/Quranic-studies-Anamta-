import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class SubscribeNewsletterInput {
  @Field()
  @IsNotEmpty({ message: 'Email address is required.' })
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  email!: string;
}
