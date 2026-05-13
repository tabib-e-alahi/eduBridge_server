import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { EnrollmentService } from './enrollment.service';

const enrollInCourse = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.body;
  const userId = (req as any).user.id;

  const result = await EnrollmentService.enrollInCourseInDB(userId, courseId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Enrolled in course successfully',
    data: result,
  });
});

const getMyEnrollments = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await EnrollmentService.getMyEnrollmentsFromDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Enrollments retrieved successfully',
    data: result,
  });
});

const updateProgress = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params; // enrollmentId
  const { lessonId, isCompleted } = req.body;
  const result = await EnrollmentService.updateProgressInDB(id as string, lessonId, isCompleted);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Progress updated successfully',
    data: result,
  });
});

const getCourseProgress = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const userId = (req as any).user.id;
  const result = await EnrollmentService.getCourseProgressFromDB(userId, courseId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course progress retrieved successfully',
    data: result,
  });
});

const getLearningSummary = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await EnrollmentService.getLearningSummaryFromDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Learning summary retrieved successfully',
    data: result,
  });
});

const getUserQuizzes = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await EnrollmentService.getUserQuizzesFromDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Quizzes retrieved successfully',
    data: result,
  });
});

const getUserQuizAttempts = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await EnrollmentService.getUserQuizAttemptsFromDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Quiz attempts retrieved successfully',
    data: result,
  });
});

const getQuizDetails = catchAsync(async (req: Request, res: Response) => {
  const { quizId } = req.params;
  const userId = (req as any).user.id;
  const result = await EnrollmentService.getQuizDetailsFromDB(userId, quizId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Quiz details retrieved successfully',
    data: result,
  });
});

const submitQuizAttempt = catchAsync(async (req: Request, res: Response) => {
  const { quizId } = req.params;
  const { answers } = req.body;
  const userId = (req as any).user.id;
  
  const result = await EnrollmentService.submitQuizAttemptInDB(userId, quizId as string, answers);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Quiz submitted successfully',
    data: result,
  });
});

const getInstructorStudents = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await EnrollmentService.getInstructorStudentsFromDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Instructor students retrieved successfully',
    data: result,
  });
});

export const EnrollmentController = {
  enrollInCourse,
  getMyEnrollments,
  getInstructorStudents,
  updateProgress,
  getCourseProgress,
  getLearningSummary,
  getUserQuizzes,
  getUserQuizAttempts,
  getQuizDetails,
  submitQuizAttempt,
};
