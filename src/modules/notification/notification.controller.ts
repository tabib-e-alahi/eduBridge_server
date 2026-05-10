import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import NotificationService from './notification.service';

const getMyNotifications = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const result = await NotificationService.getMyNotifications(userId, page, limit);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notifications fetched successfully',
    data: result,
  });
});

const markRead = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;

  await NotificationService.markAsRead(id, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification marked as read',
    data: null,
  });
});

const markAllRead = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  await NotificationService.markAllAsRead(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All notifications marked as read',
    data: null,
  });
});

const deleteNotification = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;

  await NotificationService.delete(id, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification deleted successfully',
    data: null,
  });
});

const createAnnouncement = catchAsync(async (req: Request, res: Response) => {
  const { title, message } = req.body;

  const result = await NotificationService.createAnnouncement(title, message);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Announcement created successfully',
    data: result,
  });
});

export const NotificationController = {
  getMyNotifications,
  markRead,
  markAllRead,
  deleteNotification,
  createAnnouncement,
};
