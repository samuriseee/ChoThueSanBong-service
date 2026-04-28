import { Readable } from 'stream';
import cloudinary from '../config/cloudinary';

const uploadBufferToCloudinary = (buffer: Buffer, folder: string) => {
  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Cloudinary upload failed'));
          return;
        }

        resolve(result.secure_url);
      }
    );

    Readable.from(buffer).pipe(stream);
  });
};

export const uploadFilesToCloudinary = async (files: Express.Multer.File[], folder: string) => {
  const uploads = files.map((file) => uploadBufferToCloudinary(file.buffer, folder));
  return Promise.all(uploads);
};
