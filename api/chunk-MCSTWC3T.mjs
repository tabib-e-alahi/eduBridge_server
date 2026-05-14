import {
  config_default
} from "./chunk-E2FAVKNM.mjs";

// src/utils/upload.service.ts
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
cloudinary.config({
  cloud_name: config_default.CLOUDINARY_CLOUD_NAME,
  api_key: config_default.CLOUDINARY_API_KEY,
  api_secret: config_default.CLOUDINARY_API_SECRET
});
var storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "edubridge_ai/general";
    const path = req.originalUrl;
    if (path.includes("/courses")) folder = "edubridge_ai/courses";
    else if (path.includes("/users") || path.includes("/profile")) folder = "edubridge_ai/users";
    else if (path.includes("/blogs")) folder = "edubridge_ai/blogs";
    return {
      folder,
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      transformation: [{ width: 1e3, height: 1e3, crop: "limit" }],
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`
    };
  }
});
var upload = multer({
  storage,
  limits: {
    fileSize: 0.8 * 1024 * 1024
    // 800KB limit
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  }
});
var uploadService = {
  async deleteImage(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error("Cloudinary delete error:", error);
      return null;
    }
  },
  /**
   * Standard upload middleware for single image
   */
  single(fieldName) {
    return upload.single(fieldName);
  },
  /**
   * Standard upload middleware for multiple images
   */
  array(fieldName, maxCount = 5) {
    return upload.array(fieldName, maxCount);
  },
  /**
   * Fields upload middleware
   */
  fields(fields) {
    return upload.fields(fields);
  }
};
var upload_service_default = uploadService;

export {
  upload_service_default
};
