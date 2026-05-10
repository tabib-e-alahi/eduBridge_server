import { prisma } from '../../lib/prisma';
import { LiveClass } from '../../../generated/prisma';

const createLiveClassInDB = async (payload: Partial<LiveClass>) => {
  const result = await prisma.liveClass.create({
    data: payload as any,
  });
  return result;
};

const getCourseLiveClassesFromDB = async (courseId: string) => {
  const result = await prisma.liveClass.findMany({
    where: { courseId },
    orderBy: { startTime: 'asc' },
  });
  return result;
};

const updateLiveClassInDB = async (id: string, payload: Partial<LiveClass>) => {
  const result = await prisma.liveClass.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteLiveClassFromDB = async (id: string) => {
  const result = await prisma.liveClass.delete({
    where: { id },
  });
  return result;
};

const getUserLiveClassesFromDB = async (userId: string) => {
  // Get all courses the user is enrolled in
  const enrollments = await prisma.enrollment.findMany({
    where: { userId, status: 'ACTIVE' },
    select: { courseId: true },
  });

  const courseIds = enrollments.map(e => e.courseId);

  const result = await prisma.liveClass.findMany({
    where: { courseId: { in: courseIds } },
    include: {
      course: {
        select: {
          title: true,
          instructor: { select: { name: true } },
        },
      },
    },
    orderBy: { startTime: 'asc' },
  });

  return result;
};

export const LiveClassService = {
  createLiveClassInDB,
  getCourseLiveClassesFromDB,
  getUserLiveClassesFromDB,
  updateLiveClassInDB,
  deleteLiveClassFromDB,
};
