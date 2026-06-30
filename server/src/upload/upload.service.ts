import { Injectable } from '@nestjs/common';
import cloudinary from './cloudinary.config';
import { GenerateUploadSignatureInput } from './dto/generate-upload-signature.input';

@Injectable()
export class UploadService {
    generateSignature(input: GenerateUploadSignatureInput) {
        const timestamp = Math.round(Date.now() / 1000);

        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp,
                folder: input.folder,
            },
            process.env.CLOUDINARY_API_SECRET!,
        );

        return {
            timestamp,
            signature,
            apiKey: process.env.CLOUDINARY_API_KEY!,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
            folder: input.folder,
        };
    }
}