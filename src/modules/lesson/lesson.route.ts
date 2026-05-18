import express, { Router } from 'express';
import { LessonController } from './lesson.controller';
import auth from '../../middlewares/auth';
import { PERMISSIONS } from '../../config/permissions';
import validateRequest from '../../middlewares/validateRequest';
import { requirePermission } from '../../middlewares/permission';
import { LessonValidations } from './lesson.validation';

const router: Router = Router();

router.post(
  '/',
  requirePermission(PERMISSIONS.LESSON_CREATE),
  validateRequest(LessonValidations.createLessonZodSchema),
  LessonController.createLesson
);

router.patch(
  '/reorder',
  requirePermission(PERMISSIONS.LESSON_UPDATE),
  validateRequest(LessonValidations.reorderLessonsZodSchema),
  LessonController.reorderLessons
);

router.get(
  '/:id',
  requirePermission(PERMISSIONS.LESSON_UPDATE),
  LessonController.getLessonById
);

router.patch(
  '/:id',
  requirePermission(PERMISSIONS.LESSON_UPDATE),
  validateRequest(LessonValidations.updateLessonZodSchema),
  LessonController.updateLesson
);

router.patch(
  '/:id/full',
  requirePermission(PERMISSIONS.LESSON_UPDATE),
  validateRequest(LessonValidations.updateLessonFullZodSchema),
  LessonController.updateLessonFull
);

router.delete(
  '/:id',
  requirePermission(PERMISSIONS.LESSON_DELETE),
  LessonController.deleteLesson
);

export const LessonRoutes = router;
