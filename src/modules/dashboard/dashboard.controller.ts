import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DashboardService } from './dashboard.service';

const getUserDashboard = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await DashboardService.getUserDashboardData(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User dashboard data retrieved successfully',
    data: result,
  });
});

const getInstructorDashboard = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await DashboardService.getInstructorDashboardData(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Instructor dashboard data retrieved successfully',
    data: result,
  });
});

const getInstructorEarnings = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await DashboardService.getInstructorEarningsData(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Instructor earnings data retrieved successfully',
    data: result,
  });
});

const getAdminDashboard = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardService.getAdminDashboardData();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin dashboard data retrieved successfully',
    data: result,
  });
});

export const DashboardController = {
  getUserDashboard,
  getInstructorDashboard,
  getInstructorEarnings,
  getAdminDashboard,
};
