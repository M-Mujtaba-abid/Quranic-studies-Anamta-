import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreatePaymentSettingInput } from './create-payment-setting.input';

@InputType()
export class UpdatePaymentSettingInput extends PartialType(CreatePaymentSettingInput) {
  @Field(() => ID)
  id!: string;
}
