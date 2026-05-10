import { Review } from '@prisma/client';
import { prisma } from '../../lib/prisma';

const createReviewIntoDB = async (payload: Partial<Review>) => {
  // Check if enrolled
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: payload.userId!,
        courseId: payload.courseId!,
      },
    },
  });

  if (!enrollment) {
    throw new Error('You must be enrolled in this course to leave a review.');
  }

  // Check if already reviewed
  const existingReview = await prisma.review.findUnique({
    where: {
      userId_courseId: {
        userId: payload.userId!,
        courseId: payload.courseId!,
      },
    },
  });

  if (existingReview) {
    throw new Error('You have already reviewed this course.');
  }

  const result = await prisma.review.create({
    data: payload as any,
    include: {
        user: { select: { name: true, image: true } }
    }
  });
  return result;
};

const updateReviewInDB = async (id: string, userId: string, payload: Partial<Review>) => {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review || review.userId !== userId) {
    throw new Error('Unauthorized to update this review.');
  }

  const result = await prisma.review.update({
    where: { id },
    data: {
      rating: payload.rating,
      comment: payload.comment,
      isRecommended: payload.isRecommended,
    },
  });
  return result;
};

const deleteReviewFromDB = async (id: string, userId: string, role: string) => {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw new Error('Review not found.');

  if (review.userId !== userId && role !== 'ADMIN') {
    throw new Error('Unauthorized to delete this review.');
  }

  const result = await prisma.review.delete({
    where: { id },
  });
  return result;
};

const getCourseReviewsFromDB = async (courseId: string) => {
  const reviews = await prisma.review.findMany({
    where: { courseId, isHidden: false },
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Calculate rating stats
  const total = reviews.length;
  const avg = total > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;
  
  const distribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: total > 0 ? (reviews.filter(r => r.rating === star).length / total) * 100 : 0
  }));

  return {
    reviews,
    stats: {
      averageRating: Number(avg.toFixed(1)),
      totalReviews: total,
      distribution
    }
  };
};

const getInstructorReviewsFromDB = async (instructorId: string) => {
  const result = await prisma.review.findMany({
    where: {
      course: {
        instructorId
      }
    },
    include: {
      user: { select: { name: true, image: true } },
      course: { select: { title: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  return result;
};

const getAllReviewsForAdminFromDB = async () => {
  const result = await prisma.review.findMany({
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  return result;
};

const moderateReviewInDB = async (id: string, isHidden: boolean) => {
  const result = await prisma.review.update({
    where: { id },
    data: { isHidden }
  });
  return result;
};

export const ReviewService = {
  createReviewIntoDB,
  updateReviewInDB,
  deleteReviewFromDB,
  getCourseReviewsFromDB,
  getInstructorReviewsFromDB,
  getAllReviewsForAdminFromDB,
  moderateReviewInDB
};
