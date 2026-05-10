import { Router } from 'express';
import { requirePermission, requireAuth } from '../../middlewares/permission';
import { PERMISSIONS } from '../../config/permissions';
import { NotificationController } from './notification.controller';

const router = Router();

router.get(
  '/',
  requireAuth,
  NotificationController.getMyNotifications
);

router.patch(
  '/mark-all-read',
  requireAuth,
  NotificationController.markAllRead
);

router.patch(
  '/:id/read',
  requireAuth,
  NotificationController.markRead
);

router.delete(
  '/:id',
  requireAuth,
  NotificationController.deleteNotification
);

router.post(
  '/announce',
  requirePermission(PERMISSIONS.NOTIFICATION_ANNOUNCE),
  NotificationController.createAnnouncement
);

export const NotificationRoutes = router;
