import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreatePaymentSettingInput } from './create-payment-setting.input';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UpdatePaymentSettingInput extends PartialType(CreatePaymentSettingInput) {
  @Field(() => ID)
  @IsNotEmpty({ message: 'Payment setting ID is required.' })
  @IsString()
  id!: string;
}
