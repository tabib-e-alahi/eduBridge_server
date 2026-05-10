import express from 'express';
import { requirePermission } from '../../middlewares/permission';
import { PERMISSIONS } from '../../config/permissions';
import { CategoryController } from './category.controller';

const router = express.Router();

router.get('/', CategoryController.getAllCategories);

router.post(
  '/',
  requirePermission(PERMISSIONS.CATEGORY_MANAGE),
  CategoryController.createCategory
);

export const CategoryRoutes = router;
