import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminService } from './admin.service';

const getStudents = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getSafeStudentsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students retrieved successfully (Privacy Masked)',
    data: result,
  });
});

const getInstructors = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getSafeInstructorsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Instructors retrieved successfully (Privacy Masked)',
    data: result,
  });
});

const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const adminId = (req as any).user.id;
  const { id } = req.params;
  const { role } = req.body;
  const result = await AdminService.updateUserRoleInDB(adminId, id as string, role, req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User role updated successfully',
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const adminId = (req as any).user.id;
  const { id } = req.params;
  const { status } = req.body;
  const result = await AdminService.updateUserStatusInDB(adminId, id as string, status, req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User status updated successfully',
    data: result,
  });
});

const getPendingInstructors = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getPendingInstructorsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Pending instructors retrieved successfully',
    data: result,
  });
});

const getSettings = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getSystemSettingsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'System settings retrieved successfully',
    data: result,
  });
});

const updateSetting = catchAsync(async (req: Request, res: Response) => {
  const adminId = (req as any).user.id;
  const { key, value } = req.body;
  const result = await AdminService.updateSystemSettingInDB(adminId, key, value, req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'System setting updated successfully',
    data: result,
  });
});

const getReports = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getPlatformReportsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Platform reports retrieved successfully',
    data: result,
  });
});

const updateReportStatus = catchAsync(async (req: Request, res: Response) => {
  const adminId = (req as any).user.id;
  const { id } = req.params;
  const { status } = req.body;
  const result = await AdminService.updateReportStatusInDB(adminId, id as string, status, req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Report status updated successfully',
    data: result,
  });
});

const getAuditLogs = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAuditLogsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Audit logs retrieved successfully',
    data: result,
  });
});

const getPendingCourses = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getPendingCoursesFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Pending courses retrieved successfully',
    data: result,
  });
});

const getAllCourses = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllCoursesFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All courses retrieved successfully',
    data: result,
  });
});

const updateCourseStatus = catchAsync(async (req: Request, res: Response) => {
  const adminId = (req as any).user.id;
  const { id } = req.params;
  const { status } = req.body;
  const result = await AdminService.updateCourseStatusInDB(adminId, id as string, status, req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course status updated successfully',
    data: result,
  });
});

export const AdminController = {
  getStudents,
  getInstructors,
  updateUserRole,
  updateUserStatus,
  getPendingInstructors,
  getSettings,
  updateSetting,
  getReports,
  updateReportStatus,
  getAuditLogs,
  getPendingCourses,
  getAllCourses,
  updateCourseStatus,
};
