import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

@InputType()
export class CreateStudentInput {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'First name is required.' })
  @Length(2, 50, {
    message: 'First name must be between 2 and 50 characters.',
  })
  firstName!: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Last name is required.' })
  @Length(2, 50, {
    message: 'Last name must be between 2 and 50 characters.',
  })
  lastName!: string;

  @Field()
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  email!: string;

  @Field()
  @IsNotEmpty({ message: 'Phone number is required.' })
  @Matches(/^[0-9]{10,15}$/, {
    message: 'Phone number must contain 10 to 15 digits.',
  })
  phone!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  gender?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  city?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  country?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  address?: string;
}
