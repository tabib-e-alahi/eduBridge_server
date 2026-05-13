import express, { Router } from 'express';
import { requirePermission } from '../../middlewares/permission';
import { PERMISSIONS } from '../../config/permissions';
import { DashboardController } from './dashboard.controller';

const router: Router = Router();

router.get(
  '/user',
  requirePermission(PERMISSIONS.ENROLLMENT_VIEW_OWN),
  DashboardController.getUserDashboard
);

router.get(
  '/instructor',
  requirePermission(PERMISSIONS.ANALYTICS_VIEW),
  DashboardController.getInstructorDashboard
);

router.get(
  '/admin',
  requirePermission(PERMISSIONS.ANALYTICS_VIEW_ALL),
  DashboardController.getAdminDashboard
);

export const DashboardRoutes = router;
