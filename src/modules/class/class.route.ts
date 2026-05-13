import express, { Router } from 'express';
import { requirePermission } from '../../middlewares/permission';
import { PERMISSIONS } from '../../config/permissions';
import { LiveClassController } from './class.controller';

const router: Router = Router();

router.get(
  '/user',
  requirePermission(PERMISSIONS.ENROLLMENT_VIEW_OWN),
  LiveClassController.getUserLiveClasses
);

router.post(
  '/',
  requirePermission(PERMISSIONS.CLASS_MANAGE),
  LiveClassController.createLiveClass
);

router.get(
  '/course/:courseId',
  requirePermission(PERMISSIONS.ENROLLMENT_VIEW_OWN), // Students in course can view classes
  LiveClassController.getCourseLiveClasses
);

router.patch(
  '/:id',
  requirePermission(PERMISSIONS.CLASS_MANAGE),
  LiveClassController.updateLiveClass
);

router.delete(
  '/:id',
  requirePermission(PERMISSIONS.CLASS_MANAGE),
  LiveClassController.deleteLiveClass
);

export const LiveClassRoutes = router;
