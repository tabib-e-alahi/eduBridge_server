import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OrderService } from './order.service';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { courseId } = req.body;
  const result = await OrderService.createOrderInDB(userId, courseId);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});

const checkout = catchAsync(async (req: Request, res: Response) => {
  const { orderId, transactionId, method } = req.body;
  
  // MOCK: In a real app, verify the transaction with the payment gateway here
  
  const result = await OrderService.capturePaymentInDB(orderId, transactionId, method);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment captured and enrollment successful',
    data: result,
  });
});

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await OrderService.getMyOrdersFromDB(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders retrieved successfully',
    data: result,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getAllOrdersFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All orders retrieved successfully',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  checkout,
  getMyOrders,
  getAllOrders,
};
