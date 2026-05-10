import express from 'express';
import { ReviewController } from './review.controller';
import auth from '../../middlewares/auth';
import { PERMISSIONS } from '../../config/permissions';
import { requirePermission } from 'src/middlewares/permission';

const router = express.Router();

// Public routes
router.get('/course/:courseId', ReviewController.getCourseReviews);

// Student routes
router.post(
  '/course/:courseId',
  auth(),
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
  auth(),
  requirePermission(PERMISSIONS.COURSE_VIEW_OWN),
  ReviewController.getInstructorReviews
);

// Admin routes
router.get(
  '/admin',
  auth(),
  requirePermission(PERMISSIONS.REVIEW_MANAGE),
  ReviewController.getAllReviews
);

router.patch(
  '/:reviewId/moderate',
  auth(),
  requirePermission(PERMISSIONS.REVIEW_MANAGE),
  ReviewController.moderateReview
);

export const ReviewRoutes = router;
