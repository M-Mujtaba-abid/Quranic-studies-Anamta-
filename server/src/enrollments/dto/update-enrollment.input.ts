import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateEnrollmentInput } from './create-enrollment.input';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UpdateEnrollmentInput extends PartialType(CreateEnrollmentInput) {
  @Field(() => ID)
  @IsNotEmpty({ message: 'Enrollment ID is required.' })
  @IsString()
  id!: string;
}
