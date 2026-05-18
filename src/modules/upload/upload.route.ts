import express, { Router } from 'express';
import { requireAuth } from '../../middlewares/permission';
import uploadService from '../../utils/upload.service';
import { UploadController } from './upload.controller';

const router: Router = Router();

router.post(
  '/image',
  requireAuth,
  ...uploadService.single('image'),
  UploadController.uploadImage,
);

router.delete(
  '/image/:publicId',
  requireAuth,
  UploadController.deleteImage,
);

export const UploadRoutes = router;