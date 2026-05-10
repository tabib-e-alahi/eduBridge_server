import express from 'express';
import { requirePermission } from '../../middlewares/permission';
import { PERMISSIONS } from '../../config/permissions';
import { MessageController } from './message.controller';

const router = express.Router();

router.post(
  '/',
  requirePermission(PERMISSIONS.MESSAGE_MANAGE),
  MessageController.sendMessage
);

router.get(
  '/conversations',
  requirePermission(PERMISSIONS.MESSAGE_MANAGE),
  MessageController.getConversations
);

router.get(
  '/chat/:otherUserId',
  requirePermission(PERMISSIONS.MESSAGE_MANAGE),
  MessageController.getChat
);

export const MessageRoutes = router;
