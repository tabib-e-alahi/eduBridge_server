import express, { Router } from 'express';
import { requirePermission } from '../../middlewares/permission';
import { PERMISSIONS } from '../../config/permissions';
import validateRequest from '../../middlewares/validateRequest';
import { CourseController } from './course.controller';
import { CourseValidations } from './course.validation';

const router: Router = Router();

router.get('/', CourseController.getAllCourses);
router.get('/my-courses', requirePermission(PERMISSIONS.COURSE_VIEW_OWN), CourseController.getMyCourses);
router.get('/details/:id', requirePermission(PERMISSIONS.COURSE_VIEW_OWN), CourseController.getCourseById);
router.get('/related/:id', CourseController.getRelatedCourses);
router.get('/:slug', CourseController.getCourseBySlug);

router.post(
  '/',
  requirePermission(PERMISSIONS.COURSE_CREATE),
  validateRequest(CourseValidations.createCourseZodSchema),
  CourseController.createCourse
);

router.patch(
  '/:id',
  requirePermission(PERMISSIONS.COURSE_UPDATE),
  validateRequest(CourseValidations.updateCourseZodSchema),
  CourseController.updateCourse
);

router.delete('/:id', requirePermission(PERMISSIONS.COURSE_DELETE), CourseController.deleteCourse);

export const CourseRoutes = router;
