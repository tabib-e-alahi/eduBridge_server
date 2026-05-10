import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SupportService } from './support.service';

const createTicket = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const result = await SupportService.createSupportTicketInDB({
    ...req.body,
    reporterId: userId,
  });
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Support ticket created successfully. Our team will contact you soon.',
    data: result,
  });
});

const getMyTickets = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await SupportService.getMySupportTicketsFromDB(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Support tickets retrieved successfully',
    data: result,
  });
});

export const SupportController = {
  createTicket,
  getMyTickets,
};
