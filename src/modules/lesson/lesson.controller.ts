import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { LessonService } from './lesson.service';
import { CourseService } from '../course/course.service';
import { prisma } from '../../lib/prisma';

const createLesson = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const role = (req as any).user.role;
  const { courseId } = req.body;

  // Check course ownership
  const course = await CourseService.getCourseByIdFromDB(courseId);
  if (!course) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Course not found',
      data: null,
    });
  }

  if (course.instructorId !== userId && role !== 'ADMIN') {
    return sendResponse(res, {
      statusCode: httpStatus.FORBIDDEN,
      success: false,
      message: 'You do not have permission to add lessons to this course',
      data: null,
    });
  }

  const result = await LessonService.createLessonIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Lesson created successfully',
    data: result,
  });
});

const updateLesson = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.id;
  const role = (req as any).user.role;

  const lesson = await prisma?.lesson.findUnique({ where: { id: id as string }, include: { course: true } });
  if (!lesson) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Lesson not found',
      data: null,
    });
  }

  if (lesson.course.instructorId !== userId && role !== 'ADMIN') {
    return sendResponse(res, {
      statusCode: httpStatus.FORBIDDEN,
      success: false,
      message: 'You do not have permission to update this lesson',
      data: null,
    });
  }

  const result = await LessonService.updateLessonInDB(id as string, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Lesson updated successfully',
    data: result,
  });
});

const reorderLessons = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const role = (req as any).user.role;
  const { courseId, lessonIds } = req.body;

  const course = await CourseService.getCourseByIdFromDB(courseId);
  if (!course) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Course not found',
      data: null,
    });
  }

  if (course.instructorId !== userId && role !== 'ADMIN') {
    return sendResponse(res, {
      statusCode: httpStatus.FORBIDDEN,
      success: false,
      message: 'You do not have permission to reorder lessons for this course',
      data: null,
    });
  }

  const result = await LessonService.reorderLessonsInDB(courseId, lessonIds);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Lessons reordered successfully',
    data: result,
  });
});

const getLessonById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await LessonService.getLessonWithResources(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Lesson retrieved successfully',
    data: result,
  });
});

const updateLessonFull = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.id;
  const role = (req as any).user.role;

  const lesson = await prisma.lesson.findUnique({ where: { id: id as string }, include: { course: true } });
  if (!lesson) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Lesson not found',
      data: null,
    });
  }

  if (lesson.course.instructorId !== userId && role !== 'ADMIN') {
    return sendResponse(res, {
      statusCode: httpStatus.FORBIDDEN,
      success: false,
      message: 'You do not have permission to update this lesson',
      data: null,
    });
  }

  const result = await LessonService.updateLessonWithResources(id as string, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Lesson updated successfully',
    data: result,
  });
});

const deleteLesson = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.id;
  const role = (req as any).user.role;

  const lesson = await prisma?.lesson.findUnique({ where: { id: id as string }, include: { course: true } });
  if (!lesson) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Lesson not found',
      data: null,
    });
  }

  if (lesson.course.instructorId !== userId && role !== 'ADMIN') {
    return sendResponse(res, {
      statusCode: httpStatus.FORBIDDEN,
      success: false,
      message: 'You do not have permission to delete this lesson',
      data: null,
    });
  }

  const result = await LessonService.deleteLessonFromDB(id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Lesson deleted successfully',
    data: result,
  });
});

export const LessonController = {
  createLesson,
  updateLesson,
  reorderLessons,
  getLessonById,
  updateLessonFull,
  deleteLesson,
};
