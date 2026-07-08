import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreatePaymentSettingInput {
  @Field()
  @IsNotEmpty({ message: 'Bank name is required.' })
  @IsString()
  bankName!: string;

  @Field()
  @IsNotEmpty({ message: 'Account title is required.' })
  @IsString()
  accountTitle!: string;

  @Field()
  @IsNotEmpty({ message: 'Account number is required.' })
  @IsString()
  accountNumber!: string;

  @Field()
  @IsNotEmpty({ message: 'IBAN is required.' })
  @IsString()
  iban!: string;

  @Field()
  @IsNotEmpty({ message: 'JazzCash number is required.' })
  @IsString()
  jazzCashNumber!: string;

  @Field()
  @IsNotEmpty({ message: 'JazzCash account title is required.' })
  @IsString()
  jazzCashTitle!: string;

  @Field()
  @IsNotEmpty({ message: 'EasyPaisa number is required.' })
  @IsString()
  easyPaisaNumber!: string;

  @Field()
  @IsNotEmpty({ message: 'EasyPaisa account title is required.' })
  @IsString()
  easyPaisaTitle!: string;

  @Field()
  @IsNotEmpty({ message: 'Instructions are required.' })
  @IsString()
  instructions!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
