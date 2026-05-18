import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const uploadImage = catchAsync(async (req: Request, res: Response) => {
  const file = req.file as any;

  if (!file) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'No file uploaded',
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Image uploaded successfully',
    data: {
      url: file.cloudinaryUrl,
      publicId: file.cloudinaryPublicId,
    },
  });
});

const deleteImage = catchAsync(async (req: Request, res: Response) => {
  const { publicId } = req.params;
  const uploadService = (await import('../../utils/upload.service')).default;

  const result = await uploadService.deleteImage(publicId as string);

  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: 'Failed to delete image from storage',
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Image deleted successfully',
    data: result,
  });
});

export const UploadController = {
  uploadImage,
  deleteImage,
};