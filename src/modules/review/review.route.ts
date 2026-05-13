import express, { Router } from 'express';
import { ReviewController } from './review.controller';
import auth from '../../middlewares/auth';
import { PERMISSIONS } from '../../config/permissions';
import { requirePermission } from '../../middlewares/permission';


const router: Router = Router();

// Public routes
router.get('/course/:courseId', ReviewController.getCourseReviews);

// Student routes
router.post(
  '/course/:courseId',
  requirePermission(PERMISSIONS.ENROLLMENT_VIEW_OWN), // Enrolled students can review
  ReviewController.createReview
);

router.patch(
  '/:reviewId',
  auth(),
  ReviewController.updateReview
);

router.delete(
  '/:reviewId',
  auth(),
  ReviewController.deleteReview
);

// Instructor routes
router.get(
  '/instructor',
  requirePermission(PERMISSIONS.COURSE_VIEW_OWN),
  ReviewController.getInstructorReviews
);

// Admin routes
router.get(
  '/admin',
  requirePermission(PERMISSIONS.REVIEW_MANAGE),
  ReviewController.getAllReviews
);

router.patch(
  '/:reviewId/moderate',
  requirePermission(PERMISSIONS.REVIEW_MANAGE),
  ReviewController.moderateReview
);

export const ReviewRoutes = router;
