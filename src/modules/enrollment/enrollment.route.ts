import express from 'express';
import { requirePermission } from '../../middlewares/permission';
import { PERMISSIONS } from '../../config/permissions';
import { EnrollmentController } from './enrollment.controller';

const router = express.Router();

router.get('/my-enrollments', requirePermission(PERMISSIONS.ENROLLMENT_VIEW_OWN), EnrollmentController.getMyEnrollments);
router.get('/instructor', requirePermission(PERMISSIONS.ENROLLMENT_VIEW_ALL), EnrollmentController.getInstructorStudents);

router.post(
  '/enroll',
  requirePermission(PERMISSIONS.ENROLLMENT_CREATE),
  EnrollmentController.enrollInCourse
);

router.get('/summary', requirePermission(PERMISSIONS.ENROLLMENT_VIEW_OWN), EnrollmentController.getLearningSummary);
router.get('/course/:courseId', requirePermission(PERMISSIONS.ENROLLMENT_VIEW_OWN), EnrollmentController.getCourseProgress);

router.patch(
  '/:id/progress',
  requirePermission(PERMISSIONS.ENROLLMENT_VIEW_OWN),
  EnrollmentController.updateProgress
);

router.get('/quizzes', requirePermission(PERMISSIONS.ENROLLMENT_VIEW_OWN), EnrollmentController.getUserQuizzes);
router.get('/quizzes/:quizId', requirePermission(PERMISSIONS.ENROLLMENT_VIEW_OWN), EnrollmentController.getQuizDetails);
router.post('/quizzes/:quizId/submit', requirePermission(PERMISSIONS.ENROLLMENT_VIEW_OWN), EnrollmentController.submitQuizAttempt);
router.get('/quiz-attempts', requirePermission(PERMISSIONS.ENROLLMENT_VIEW_OWN), EnrollmentController.getUserQuizAttempts);

export const EnrollmentRoutes = router;
