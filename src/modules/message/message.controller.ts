import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { MessageService } from './message.service';

const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const senderId = (req as any).user.id;
  const result = await MessageService.sendMessageInDB({
    ...req.body,
    senderId,
  });
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Message sent successfully',
    data: result,
  });
});

const getConversations = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await MessageService.getMyConversationsFromDB(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Conversations retrieved successfully',
    data: result,
  });
});

const getChat = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { otherUserId } = req.params;
  const result = await MessageService.getChatWithUserFromDB(userId, otherUserId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Chat retrieved successfully',
    data: result,
  });
});

export const MessageController = {
  sendMessage,
  getConversations,
  getChat,
};
