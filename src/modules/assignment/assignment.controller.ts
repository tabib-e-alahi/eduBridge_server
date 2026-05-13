import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AssignmentService } from './assignment.service';

const createAssignment = catchAsync(async (req: Request, res: Response) => {
  const result = await AssignmentService.createAssignmentInDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Assignment created successfully',
    data: result,
  });
});

const getCourseAssignments = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const result = await AssignmentService.getCourseAssignmentsFromDB(courseId as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Assignments retrieved successfully',
    data: result,
  });
});

const getUserAssignments = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await AssignmentService.getUserAssignmentsFromDB(userId as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User assignments retrieved successfully',
    data: result,
  });
});

const submitAssignment = catchAsync(async (req: Request, res: Response) => {
  const studentId = (req as any).user.id;
  const result = await AssignmentService.submitAssignmentToDB({
    ...req.body,
    studentId,
  });
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Assignment submitted successfully',
    data: result,
  });
});

const getSubmissions = catchAsync(async (req: Request, res: Response) => {
  const { assignmentId } = req.params;
  const result = await AssignmentService.getSubmissionsFromDB(assignmentId as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Submissions retrieved successfully',
    data: result,
  });
});

const gradeSubmission = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AssignmentService.gradeSubmissionInDB(id as string, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Submission graded successfully',
    data: result,
  });
});

const getInstructorAssignments = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await AssignmentService.getInstructorAssignmentsFromDB(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Instructor assignments retrieved successfully',
    data: result,
  });
});

export const AssignmentController = {
  createAssignment,
  getCourseAssignments,
  getUserAssignments,
  getInstructorAssignments,
  submitAssignment,
  getSubmissions,
  gradeSubmission,
};
