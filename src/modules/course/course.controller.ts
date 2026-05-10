import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CourseService } from './course.service';

const createCourse = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await CourseService.createCourseIntoDB({ 
    ...req.body, 
    instructorId: userId 
  });
  
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Course created successfully',
    data: result,
  });
});

const getMyCourses = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await CourseService.getInstructorCoursesFromDB(userId);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Instructor courses retrieved successfully',
    data: result,
  });
});

const getCourseById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CourseService.getCourseByIdFromDB(id);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course retrieved successfully',
    data: result,
  });
});

const getAllCourses = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.getAllCoursesFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getCourseBySlug = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const result = await CourseService.getCourseBySlugFromDB(slug);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course retrieved successfully',
    data: result,
  });
});

const updateCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.id;
  const role = (req as any).user.role;

  // Check ownership unless admin
  const course = await CourseService.getCourseByIdFromDB(id);
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
      message: 'You do not have permission to update this course',
      data: null,
    });
  }

  const result = await CourseService.updateCourseInDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course updated successfully',
    data: result,
  });
});

const deleteCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.id;
  const role = (req as any).user.role;

  // Check ownership unless admin
  const course = await CourseService.getCourseByIdFromDB(id);
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
      message: 'You do not have permission to delete this course',
      data: null,
    });
  }

  const result = await CourseService.deleteCourseFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course archived successfully',
    data: result,
  });
});

const getRelatedCourses = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CourseService.getRelatedCoursesFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Related courses retrieved successfully',
    data: result,
  });
});

export const CourseController = {
  createCourse,
  getMyCourses,
  getCourseById,
  getAllCourses,
  getCourseBySlug,
  getRelatedCourses,
  updateCourse,
  deleteCourse,
};
