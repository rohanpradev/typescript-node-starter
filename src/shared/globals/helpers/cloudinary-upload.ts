import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse, UploadApiOptions } from 'cloudinary';
import { promisify } from 'util';

type UploadResponse = UploadApiResponse | UploadApiErrorResponse | undefined;

const cloudinaryUploadPromise: (file: string, options: UploadApiOptions | undefined) => Promise<UploadResponse> =
  promisify(cloudinary.uploader.upload);

export function uploads(
  file: string,
  public_id?: string,
  overwrite?: boolean,
  invalidate?: boolean
): Promise<UploadResponse> {
  return cloudinaryUploadPromise(file, { public_id, overwrite, invalidate });
}
