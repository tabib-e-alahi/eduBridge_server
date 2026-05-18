import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AIService } from './ai.service';

const generateLearningPath = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const result = await AIService.generateLearningPath(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Learning roadmap generated successfully',
    data: result,
  });
});

const getCourseRecommendations = catchAsync(async (req: Request, res: Response) => {
  const { interests, level } = req.body;
  const userId = (req as any).user.id;

  const result = await AIService.getCourseRecommendations(userId, interests, level);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course recommendations generated successfully',
    data: result,
  });
});

const generateQuiz = catchAsync(async (req: Request, res: Response) => {
  const { topic, difficulty, count } = req.body;
  const userId = (req as any).user.id;

  const result = await AIService.generateQuiz(userId, topic, difficulty, count);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Quiz generated successfully',
    data: result,
  });
});

const generateInstructorQuiz = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await AIService.generateQuiz(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Instructor quiz generated successfully',
    data: result,
  });
});

const generateCourseOutline = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await AIService.generateCourseOutline(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course outline generated successfully',
    data: result,
  });
});

const generateLessonDescription = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await AIService.generateLessonDescription(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Lesson description generated successfully',
    data: result,
  });
});

const analyzeInstructorEngagement = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await AIService.analyzeInstructorEngagement(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Instructor engagement analysis completed',
    data: result,
  });
});

const chatWithAI = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const result = await AIService.chatWithAI(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AI response received',
    data: result,
  });
});

const analyzeProgress = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const result = await AIService.analyzeProgress(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Progress analysis completed',
    data: result,
  });
});

const getConversations = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await AIService.getConversations(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AI conversations retrieved successfully',
    data: result,
  });
});

const getConversationById = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  const result = await AIService.getConversationById(userId, id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AI conversation retrieved successfully',
    data: result,
  });
});

const getUserLearningPaths = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await AIService.getUserLearningPaths(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User learning paths retrieved successfully',
    data: result,
  });
});

export const AIController = {
  generateLearningPath,
  getCourseRecommendations,
  generateQuiz,
  generateInstructorQuiz,
  generateCourseOutline,
  generateLessonDescription,
  analyzeInstructorEngagement,
  chatWithAI,
  analyzeProgress,
  getConversations,
  getConversationById,
  getUserLearningPaths,
};
