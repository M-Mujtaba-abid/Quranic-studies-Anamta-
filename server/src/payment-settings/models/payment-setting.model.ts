import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaymentSetting {
  @Field(() => ID)
  id!: string;

  @Field()
  bankName!: string;

  @Field()
  accountTitle!: string;

  @Field()
  accountNumber!: string;

  @Field()
  iban!: string;

  @Field()
  jazzCashNumber!: string;

  @Field()
  easyPaisaNumber!: string;

  @Field()
  instructions!: string;

  @Field()
  isActive!: boolean;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
