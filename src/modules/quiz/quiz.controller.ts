import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { prisma } from '../../lib/prisma';
import { QuizService } from './quiz.service';

const ensureCourseAccess = async (courseId: string, userId: string, role: string) => {
  const course = await prisma.course.findUnique({ where: { id: courseId }, select: { instructorId: true } });
  if (!course) throw new Error('Course not found');
  if (course.instructorId !== userId && role !== 'ADMIN') throw new Error('You do not have permission to manage this course');
  return course;
};

const ensureQuizAccess = async (quizId: string, userId: string, role: string) => {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { course: { select: { instructorId: true } } },
  });
  if (!quiz) throw new Error('Quiz not found');
  if (quiz.course.instructorId !== userId && role !== 'ADMIN') throw new Error('You do not have permission to manage this quiz');
  return quiz;
};

const createQuiz = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const role = (req as any).user.role;

  await ensureCourseAccess(req.body.courseId, userId, role);
  const result = await QuizService.createQuizInDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Quiz created successfully',
    data: result,
  });
});

const getQuizzesByCourse = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const userId = (req as any).user.id;
  const role = (req as any).user.role;

  await ensureCourseAccess(courseId as string, userId, role);
  const result = await QuizService.getQuizzesByCourseId(courseId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course quizzes retrieved successfully',
    data: result,
  });
});

const updateQuiz = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.id;
  const role = (req as any).user.role;

  const quiz = await ensureQuizAccess(id as string, userId, role);
  if (req.body.courseId && req.body.courseId !== quiz.courseId) {
    await ensureCourseAccess(req.body.courseId, userId, role);
  }

  const result = await QuizService.updateQuizInDB(id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Quiz updated successfully',
    data: result,
  });
});

const deleteQuiz = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.id;
  const role = (req as any).user.role;

  await ensureQuizAccess(id as string, userId, role);
  const result = await QuizService.deleteQuizFromDB(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Quiz deleted successfully',
    data: result,
  });
});

const getQuizResults = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.id;
  const role = (req as any).user.role;

  await ensureQuizAccess(id as string, userId, role);
  const result = await QuizService.getQuizResults(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Quiz results retrieved successfully',
    data: result,
  });
});

export const QuizController = {
  createQuiz,
  getQuizzesByCourse,
  updateQuiz,
  deleteQuiz,
  getQuizResults,
};
