import { Router } from 'express';
import { requirePermission, requireAuth } from '../../middlewares/permission';
import { PERMISSIONS } from '../../config/permissions';
import { NotificationController } from './notification.controller';
import validateRequest from '../../middlewares/validateRequest';
import { z } from 'zod';

const router: Router = Router();

const courseAnnouncementSchema = z.object({
  body: z.object({
    courseId: z.string('Course ID is required'),
    title: z.string('Title is required').min(1),
    message: z.string('Message is required').min(1),
  }),
});

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

router.post(
  '/announcement',
  requirePermission(PERMISSIONS.NOTIFICATION_ANNOUNCE),
  validateRequest(courseAnnouncementSchema),
  NotificationController.sendCourseAnnouncement
);

export const NotificationRoutes = router;
