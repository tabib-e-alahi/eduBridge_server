import {
  config_default
} from "./chunk-Y6NVD232.mjs";

// src/utils/upload.service.ts
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { Readable } from "stream";
cloudinary.config({
  cloud_name: config_default.CLOUDINARY_CLOUD_NAME,
  api_key: config_default.CLOUDINARY_API_KEY,
  api_secret: config_default.CLOUDINARY_API_SECRET
});
var ALLOWED_FORMATS = ["image/jpeg", "image/png", "image/webp"];
var MAX_SIZE = 0.8 * 1024 * 1024;
var getFolder = (url) => {
  if (url.includes("/courses")) return "edubridge_ai/courses";
  if (url.includes("/users") || url.includes("/profile")) return "edubridge_ai/users";
  if (url.includes("/blogs")) return "edubridge_ai/blogs";
  return "edubridge_ai/general";
};
var uploadToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
    const publicId = `${Date.now()}-${file.originalname.split(".")[0]}`;
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
        transformation: [{ width: 1e3, height: 1e3, crop: "limit" }]
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    Readable.from(file.buffer).pipe(stream);
  });
};
var cloudinaryUploadMiddleware = (req, res, next) => {
  const files = req.files ? Array.isArray(req.files) ? req.files : Object.values(req.files).flat() : req.file ? [req.file] : [];
  if (!files.length) return next();
  const folder = getFolder(req.originalUrl);
  Promise.all(files.map((f) => uploadToCloudinary(f, folder))).then((results) => {
    if (req.file) {
      req.file.cloudinaryUrl = results[0]?.url;
      req.file.cloudinaryPublicId = results[0]?.publicId;
    }
    next();
  }).catch(next);
};
var memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_FORMATS.includes(file.mimetype)) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  }
});
var uploadService = {
  async deleteImage(publicId) {
    try {
      return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Cloudinary delete error:", error);
      return null;
    }
  },
  single(fieldName) {
    return [memoryUpload.single(fieldName), cloudinaryUploadMiddleware];
  },
  array(fieldName, maxCount = 5) {
    return [memoryUpload.array(fieldName, maxCount), cloudinaryUploadMiddleware];
  },
  fields(fields) {
    return [memoryUpload.fields(fields), cloudinaryUploadMiddleware];
  }
};
var upload_service_default = uploadService;

export {
  upload_service_default
};
