import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UploadService } from './upload.service';
import { UploadSignature } from './models/upload-signature.model';
import { GenerateUploadSignatureInput } from './dto/generate-upload-signature.input';

@Resolver()
export class UploadResolver {
    constructor(
        private readonly uploadService: UploadService,
    ) { }

    @Mutation(() => UploadSignature)
    generateUploadSignature(
        @Args('input')
        input: GenerateUploadSignatureInput,
    ) {
        return this.uploadService.generateSignature(input);
    }
}