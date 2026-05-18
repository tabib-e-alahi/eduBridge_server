import { v2 as cloudinary } from 'cloudinary';
import multer, { Field, FileFilterCallback } from 'multer';
import { Request, RequestHandler } from 'express';
import { Readable } from 'stream';
import envConfig from '../config';

cloudinary.config({
  cloud_name: envConfig.CLOUDINARY_CLOUD_NAME,
  api_key: envConfig.CLOUDINARY_API_KEY,
  api_secret: envConfig.CLOUDINARY_API_SECRET,
});

const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 0.8 * 1024 * 1024; // 800KB

const getFolder = (url: string): string => {
  if (url.includes('/courses')) return 'edubridge_ai/courses';
  if (url.includes('/users') || url.includes('/profile')) return 'edubridge_ai/users';
  if (url.includes('/blogs')) return 'edubridge_ai/blogs';
  return 'edubridge_ai/general';
};

const uploadToCloudinary = (
  file: Express.Multer.File,
  folder: string,
): Promise<{ url: string; publicId: string }> => {
  return new Promise((resolve, reject) => {
    const publicId = `${Date.now()}-${file.originalname.split('.')[0]}`;
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );
    Readable.from(file.buffer).pipe(stream);
  });
};

const cloudinaryUploadMiddleware = (req: Request, res: any, next: any) => {
  const files = req.files
    ? Array.isArray(req.files)
      ? req.files
      : Object.values(req.files as Record<string, Express.Multer.File[]>).flat()
    : req.file
      ? [req.file]
      : [];

  if (!files.length) return next();

  const folder = getFolder(req.originalUrl);

  Promise.all(files.map((f) => uploadToCloudinary(f, folder)))
    .then((results) => {
      if (req.file) {
        (req.file as any).cloudinaryUrl = results[0]?.url;
        (req.file as any).cloudinaryPublicId = results[0]?.publicId;
      }
      next();
    })
    .catch(next);
};

const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (!ALLOWED_FORMATS.includes(file.mimetype)) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  },
});

const uploadService = {
  async deleteImage(publicId: string) {
    try {
      return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      return null;
    }
  },

  single(fieldName: string): RequestHandler[] {
    return [memoryUpload.single(fieldName), cloudinaryUploadMiddleware];
  },

  array(fieldName: string, maxCount: number = 5): RequestHandler[] {
    return [memoryUpload.array(fieldName, maxCount), cloudinaryUploadMiddleware];
  },

  fields(fields: Field[]): RequestHandler[] {
    return [memoryUpload.fields(fields), cloudinaryUploadMiddleware];
  },
};

export default uploadService;