import { prisma } from '../../lib/prisma';

const createOrderInDB = async (userId: string, courseId: string) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new Error('Course not found');

  const result = await prisma.order.create({
    data: {
      userId,
      courseId,
      amount: course.price,
      currency: 'USD',
      status: 'PENDING',
    },
  });
  return result;
};

const capturePaymentInDB = async (orderId: string, transactionId: string, method: string) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Update Order
    const order = await tx.order.update({
      where: { id: orderId },
      data: {
        status: 'SUCCESS',
        transactionId,
        paymentMethod: method,
      },
    });

    // 2. Create Payment record
    await tx.payment.create({
      data: {
        orderId,
        amount: order.amount,
        status: 'COMPLETED',
        transactionId,
        method,
      },
    });

    // 3. Automatically Enroll User in Course (skip if already enrolled)
    const existingEnrollment = await tx.enrollment.findUnique({
      where: { userId_courseId: { userId: order.userId, courseId: order.courseId } },
    });
    if (!existingEnrollment) {
      await tx.enrollment.create({
        data: {
          userId: order.userId,
          courseId: order.courseId,
          status: 'ACTIVE',
        },
      });
    }

    return order;
  });
};

const getMyOrdersFromDB = async (userId: string) => {
  const result = await prisma.order.findMany({
    where: { userId },
    include: { course: { select: { title: true, thumbnailUrl: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return result;
};

const getAllOrdersFromDB = async () => {
  const result = await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return result.map(order => ({
    ...order,
    user: {
      ...order.user,
      email: order.user?.email ? `${order.user.email.substring(0, 2)}***@${order.user.email.split('@')[1]}` : "Unknown",
    }
  }));
};

export const OrderService = {
  createOrderInDB,
  capturePaymentInDB,
  getMyOrdersFromDB,
  getAllOrdersFromDB,
};
