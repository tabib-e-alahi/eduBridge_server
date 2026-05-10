import express from 'express';
import { requirePermission } from '../../middlewares/permission';
import { PERMISSIONS } from '../../config/permissions';
import { AssignmentController } from './assignment.controller';

const router = express.Router();

router.post(
  '/',
  requirePermission(PERMISSIONS.ASSIGNMENT_CREATE),
  AssignmentController.createAssignment
);

router.get(
  '/user',
  requirePermission(PERMISSIONS.ENROLLMENT_VIEW_OWN),
  AssignmentController.getUserAssignments
);

router.get(
  '/instructor',
  requirePermission(PERMISSIONS.ASSIGNMENT_GRADE),
  AssignmentController.getInstructorAssignments
);

router.get(
  '/course/:courseId',
  requirePermission(PERMISSIONS.ENROLLMENT_VIEW_OWN), // Students in course can view assignments
  AssignmentController.getCourseAssignments
);

router.post(
  '/submit',
  requirePermission(PERMISSIONS.ASSIGNMENT_SUBMIT),
  AssignmentController.submitAssignment
);

router.get(
  '/submissions/:assignmentId',
  requirePermission(PERMISSIONS.ASSIGNMENT_GRADE),
  AssignmentController.getSubmissions
);

router.patch(
  '/grade/:id',
  requirePermission(PERMISSIONS.ASSIGNMENT_GRADE),
  AssignmentController.gradeSubmission
);

export const AssignmentRoutes = router;
