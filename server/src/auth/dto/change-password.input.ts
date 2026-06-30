import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, Length } from 'class-validator';

@InputType()
export class ChangePasswordInput {
  @Field()
  @IsNotEmpty({ message: 'Current password is required.' })
  currentPassword!: string;

  @Field()
  @IsNotEmpty({ message: 'New password is required.' })
  @Length(6, 100, { message: 'New password must be between 6 and 100 characters.' })
  newPassword!: string;
}
