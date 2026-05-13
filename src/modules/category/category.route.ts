import express, { Router } from 'express';
import { requirePermission } from '../../middlewares/permission';
import { PERMISSIONS } from '../../config/permissions';
import { CategoryController } from './category.controller';

const router: Router = Router();

router.get('/', CategoryController.getAllCategories);

router.post(
  '/',
  requirePermission(PERMISSIONS.CATEGORY_MANAGE),
  CategoryController.createCategory
);

export const CategoryRoutes = router;
