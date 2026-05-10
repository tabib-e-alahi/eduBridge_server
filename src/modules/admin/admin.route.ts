import express from 'express';
import { requirePermission } from '../../middlewares/permission';
import { PERMISSIONS } from '../../config/permissions';
import { AdminController } from './admin.controller';

const router = express.Router();

router.get(
  '/students',
  requirePermission(PERMISSIONS.USER_VIEW),
  AdminController.getStudents
);

router.get(
  '/instructors',
  requirePermission(PERMISSIONS.USER_VIEW),
  AdminController.getInstructors
);

router.patch(
  '/users/:id/role',
  requirePermission(PERMISSIONS.USER_MANAGE_ROLE),
  AdminController.updateUserRole
);

router.patch(
  '/users/:id/status',
  requirePermission(PERMISSIONS.USER_MANAGE_ROLE),
  AdminController.updateUserStatus
);

router.get(
  '/pending-instructors',
  requirePermission(PERMISSIONS.USER_MANAGE_ROLE),
  AdminController.getPendingInstructors
);

router.get(
  '/settings',
  requirePermission(PERMISSIONS.SYSTEM_MANAGE),
  AdminController.getSettings
);

router.post(
  '/settings',
  requirePermission(PERMISSIONS.SYSTEM_MANAGE),
  AdminController.updateSetting
);

router.get(
  '/reports',
  requirePermission(PERMISSIONS.USER_VIEW),
  AdminController.getReports
);

router.patch(
  '/reports/:id/status',
  requirePermission(PERMISSIONS.USER_MANAGE_ROLE),
  AdminController.updateReportStatus
);

router.get(
  '/audit-logs',
  requirePermission(PERMISSIONS.USER_VIEW),
  AdminController.getAuditLogs
);

router.get(
  '/courses',
  requirePermission(PERMISSIONS.USER_VIEW),
  AdminController.getAllCourses
);

router.get(
  '/courses/pending',
  requirePermission(PERMISSIONS.USER_VIEW),
  AdminController.getPendingCourses
);

router.patch(
  '/courses/:id/status',
  requirePermission(PERMISSIONS.USER_MANAGE_ROLE),
  AdminController.updateCourseStatus
);

export const AdminRoutes = router;
