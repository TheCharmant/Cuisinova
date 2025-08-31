import * as https from 'https';
import { Transform as Stream } from 'stream';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { StreamingBlobPayloadInputTypes } from '@smithy/types';
import { UploadReturnType } from '../types';

// Interface for image upload parameters
interface UploadToS3Type {
    originalImgLink: string | undefined;
    userId: string | undefined;
    location: string;
}

// Process an image from URL and return as a Buffer
export const processImage = (url: string): Promise<Buffer> =>
    new Promise((resolve, reject) => {
        https.get(url, (response) => {
            const data: Uint8Array[] = [];
            response.on('data', (chunk) => data.push(chunk));
            response.on('end', () => resolve(Buffer.concat(data)));
            response.on('error', reject);
        }).on('error', reject);
    });

// Configure S3 client
export const configureS3 = () => (
    process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
        ? new S3Client({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
            region: 'ap-southeast-2', // ✅ Correct region
            forcePathStyle: false,
        })
        : null
);

// Upload a single image to S3
export const uploadImageToS3 = async ({
    originalImgLink,
    userId,
    location
}: UploadToS3Type): Promise<UploadReturnType> => {
    try {
        if (!originalImgLink) throw new Error('Image link is undefined');

        const s3 = configureS3();
        if (!s3) throw new Error('Unable to configure S3');

        const Body = await processImage(originalImgLink);

        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME || '',
            Key: location,
            Body,
            ContentType: 'image/png',
            Tagging: `userId=${userId}`,
            CacheControl: "public, max-age=2592000", // 30-day cache
        });

        await s3.send(command);

        // Return S3 URL without region for consistency with frontend expectations
        return {
            location: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${location}`,
            uploaded: true
        };
    } catch (error) {
        console.error(`Error uploading image ${originalImgLink?.slice(0, 50)}... - ${error}`);
        return {
            location,
            uploaded: false
        };
    }
};

// Upload multiple images to S3
export const uploadImagesToS3 = async (images: UploadToS3Type[]): Promise<UploadReturnType[] | null> => {
    try {
        const results = await Promise.all(images.map(img => uploadImageToS3(img)));
        return results;
    } catch (error) {
        console.error(error);
        return null;
    }
};

// Upload audio buffer to S3
export const uploadAudioToS3 = async (audioBuffer: Buffer, fileName: string): Promise<string> => {
    try {
        const s3 = configureS3();
        if (!s3) throw new Error('Unable to configure S3');

        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME || '',
            Key: `audio/${fileName}`,
            Body: audioBuffer,
            ContentType: 'audio/mpeg',
            CacheControl: "public, max-age=2592000",
        });

        await s3.send(command);

        // Return S3 URL without region for consistency with frontend expectations
        return `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/audio/${fileName}`;
    } catch (error) {
        console.error(`Error uploading audio to S3. File: ${fileName} - ${error}`);
        throw new Error(`Failed to upload audio to S3: ${error}`);
    }
};
