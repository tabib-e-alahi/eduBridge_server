import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReviewService } from './review.service';

const createReview = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { courseId } = req.params;
  const result = await ReviewService.createReviewIntoDB({
    ...req.body,
    userId,
    courseId,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Review submitted successfully',
    data: result,
  });
});

const getCourseReviews = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const result = await ReviewService.getCourseReviewsFromDB(courseId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reviews retrieved successfully',
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const userId = (req as any).user.id;
  const result = await ReviewService.updateReviewInDB(reviewId, userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review updated successfully',
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const userId = (req as any).user.id;
  const role = (req as any).user.role;
  const result = await ReviewService.deleteReviewFromDB(reviewId, userId, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review deleted successfully',
    data: result,
  });
});

const getInstructorReviews = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await ReviewService.getInstructorReviewsFromDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Instructor reviews retrieved successfully',
    data: result,
  });
});

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getAllReviewsForAdminFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All reviews retrieved successfully',
    data: result,
  });
});

const moderateReview = catchAsync(async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const { isHidden } = req.body;
  const result = await ReviewService.moderateReviewInDB(reviewId, isHidden);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Review ${isHidden ? 'hidden' : 'unhidden'} successfully`,
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getCourseReviews,
  updateReview,
  deleteReview,
  getInstructorReviews,
  getAllReviews,
  moderateReview
};
