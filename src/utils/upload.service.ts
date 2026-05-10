import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import { Request } from 'express';
import envConfig from 'src/config';

// Configure Cloudinary
cloudinary.config({
  cloud_name: envConfig.CLOUDINARY_CLOUD_NAME,
  api_key: envConfig.CLOUDINARY_API_KEY,
  api_secret: envConfig.CLOUDINARY_API_SECRET,
});

// Configure Storage for Multer-Storage-Cloudinary v4
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: Request, file: Express.Multer.File) => {
    // Determine folder based on route/entity
    let folder = 'edubridge_ai/general';
    const path = req.originalUrl;

    if (path.includes('/courses')) folder = 'edubridge_ai/courses';
    else if (path.includes('/users') || path.includes('/profile')) folder = 'edubridge_ai/users';
    else if (path.includes('/blogs')) folder = 'edubridge_ai/blogs';

    return {
      folder: folder,
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
      transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    };
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!') as any);
    }
    cb(null, true);
  },
});

const uploadService = {
  /**
   * Delete an image from Cloudinary
   */
  async deleteImage(publicId: string) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      return null;
    }
  },

  /**
   * Standard upload middleware for single image
   */
  single(fieldName: string) {
    return upload.single(fieldName);
  },

  /**
   * Standard upload middleware for multiple images
   */
  array(fieldName: string, maxCount: number = 5) {
    return upload.array(fieldName, maxCount);
  },

  /**
   * Fields upload middleware
   */
  fields(fields: multer.Field[]) {
    return upload.fields(fields);
  }
};

export default uploadService;
