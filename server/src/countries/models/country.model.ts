import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { EnrollmentMode } from '@prisma/client';

registerEnumType(EnrollmentMode, {
  name: 'EnrollmentMode',
  description: 'Available enrollment modes: ONE_ON_ONE or GROUP',
});

@ObjectType()
export class Country {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  code: string;

  @Field()
  currency: string;

  @Field(() => [EnrollmentMode])
  supportedModes: EnrollmentMode[];
}
