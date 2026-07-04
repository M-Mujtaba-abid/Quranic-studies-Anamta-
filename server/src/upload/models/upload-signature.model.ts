import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UploadSignature {
    @Field(() => Int)
    timestamp!: number;

    @Field(() => String)
    signature!: string;

    @Field(() => String)
    apiKey!: string;

    @Field(() => String)
    cloudName!: string;

    @Field(() => String)
    folder!: string;
}