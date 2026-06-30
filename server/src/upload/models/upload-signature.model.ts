import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UploadSignature {
    @Field()
    timestamp!: number;

    @Field()
    signature!: string;

    @Field()
    apiKey!: string;

    @Field()
    cloudName!: string;

    @Field()
    folder!: string;
}