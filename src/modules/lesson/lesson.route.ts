import express, { Router } from 'express';
import { LessonController } from './lesson.controller';
import auth from '../../middlewares/auth';
import { PERMISSIONS } from '../../config/permissions';
import validateRequest from '../../middlewares/validateRequest';
import { z } from 'zod';
import { requirePermission } from '../../middlewares/permission';

const router: Router = Router();

const lessonSchema = z.object({
  body: z.object({
    title: z.string('Title is required'),
    slug: z.string('Slug is required'),
    content: z.string().optional(),
    videoUrl: z.string().optional(),
    duration: z.string().optional(),
    order: z.number('Order is required'),
    courseId: z.string('Course ID is required'),
  }),
});

router.post(
  '/',
  requirePermission(PERMISSIONS.LESSON_CREATE),
  validateRequest(lessonSchema),
  LessonController.createLesson
);

router.patch(
  '/:id',
  requirePermission(PERMISSIONS.LESSON_UPDATE),
  LessonController.updateLesson
);

router.delete(
  '/:id',
  requirePermission(PERMISSIONS.LESSON_DELETE),
  LessonController.deleteLesson
);

export const LessonRoutes = router;
