import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { MentorService } from './mentor.service';

const getAllMentors = catchAsync(async (req: Request, res: Response) => {
  const result = await MentorService.getAllMentorsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Mentors retrieved successfully',
    data: result,
  });
});

const getMentorDetails = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MentorService.getMentorDetailsFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Mentor details retrieved successfully',
    data: result,
  });
});

export const MentorController = {
  getAllMentors,
  getMentorDetails,
};
