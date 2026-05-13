import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { LiveClassService } from './class.service';

const createLiveClass = catchAsync(async (req: Request, res: Response) => {
  const result = await LiveClassService.createLiveClassInDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Live class scheduled successfully',
    data: result,
  });
});

const getCourseLiveClasses = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const result = await LiveClassService.getCourseLiveClassesFromDB(courseId as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Live classes retrieved successfully',
    data: result,
  });
});

const updateLiveClass = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await LiveClassService.updateLiveClassInDB(id as string, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Live class updated successfully',
    data: result,
  });
});

const deleteLiveClass = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await LiveClassService.deleteLiveClassFromDB(id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Live class deleted successfully',
    data: null,
  });
});

const getUserLiveClasses = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await LiveClassService.getUserLiveClassesFromDB(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User live classes retrieved successfully',
    data: result,
  });
});

export const LiveClassController = {
  createLiveClass,
  getCourseLiveClasses,
  getUserLiveClasses,
  updateLiveClass,
  deleteLiveClass,
};
