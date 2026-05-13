import { Course, Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';

const createCourseIntoDB = async (payload: any) => {
  const { lessons, ...courseData } = payload;
  
  const result = await prisma.course.create({
    data: {
      ...courseData,
      lessons: {
        create: lessons?.map((lesson: any, index: number) => ({
          ...lesson,
          slug: lesson.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
          order: index + 1
        }))
      }
    },
    include: {
      lessons: true,
      category: true,
    }
  });
  return result;
};

const getAllCoursesFromDB = async (query: any) => {
  const { 
    searchTerm, 
    category, 
    level, 
    minPrice, 
    maxPrice, 
    sortBy = 'createdAt', 
    sortOrder = 'desc', 
    page = 1, 
    limit = 10 
  } = query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const filter: Prisma.CourseWhereInput = {
    status: 'PUBLISHED',
  };

  if (searchTerm) {
    filter.OR = [
      { title: { contains: searchTerm, mode: 'insensitive' } },
      { description: { contains: searchTerm, mode: 'insensitive' } },
    ];
  }

  if (category) {
    filter.category = { slug: category };
  }

  if (level) {
    filter.level = level;
  }

  if (minPrice || maxPrice) {
    filter.price = {
      ...(minPrice ? { gte: Number(minPrice) } : {}),
      ...(maxPrice ? { lte: Number(maxPrice) } : {}),
    } as Prisma.FloatFilter;
  }

  const result = await prisma.course.findMany({
    where: filter,
    include: {
      instructor: {
        select: { name: true, email: true },
      },
      category: true,
      _count: {
        select: { reviews: true },
      },
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take,
  });

  const total = await prisma.course.count({ where: filter });

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPage: Math.ceil(total / Number(limit)),
    },
    data: result,
  };
};

const getCourseBySlugFromDB = async (slug: string) => {
  const result = await prisma.course.findUnique({
    where: { slug },
    include: {
      instructor: true,
      category: true,
      lessons: {
        orderBy: { order: 'asc' },
      },
      reviews: {
        include: { user: true },
      },
      _count: {
        select: { enrollments: true },
      },
    },
  });
  return result;
};

const updateCourseInDB = async (id: string, payload: Partial<Course>) => {
  const result = await prisma.course.update({
    where: { id },
    data: payload,
  });

  // If status changed to PUBLISHED, notify all users
  if (payload.status === 'PUBLISHED') {
    const NotificationService = (await import('../notification/notification.service')).default;
    NotificationService.notifyNewCoursePublished(result.title);
  }

  return result;
};

const deleteCourseFromDB = async (id: string) => {
  const result = await prisma.course.update({
    where: { id },
    data: { status: 'ARCHIVED' },
  });
  return result;
};

const getMyCoursesFromDB = async (instructorId: string) => {
  const result = await prisma.course.findMany({
    where: { instructorId },
    include: {
      category: true,
      _count: {
        select: { enrollments: true, reviews: true, lessons: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return result;
};

const getCourseByIdFromDB = async (id: string) => {
  const result = await prisma.course.findUnique({
    where: { id },
    include: {
      category: true,
      lessons: {
        orderBy: { order: 'asc' },
      },
      assignments: true,
      quizzes: true,
    },
  });
  return result;
};

const getRelatedCoursesFromDB = async (courseId: string) => {
  const currentCourse = await prisma.course.findUnique({
    where: { id: courseId },
    select: { categoryId: true, level: true }
  });

  if (!currentCourse) throw new Error('Course not found');

  const result = await prisma.course.findMany({
    where: {
      categoryId: currentCourse.categoryId,
      id: { not: courseId },
      status: 'PUBLISHED'
    },
    include: {
      instructor: { select: { name: true } },
      category: true,
      _count: { select: { reviews: true } }
    },
    take: 4,
    orderBy: { createdAt: 'desc' }
  });

  return result;
};

export const CourseService = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getCourseBySlugFromDB,
  getMyCoursesFromDB,
  getCourseByIdFromDB,
  getRelatedCoursesFromDB,
  updateCourseInDB,
  deleteCourseFromDB,
};
