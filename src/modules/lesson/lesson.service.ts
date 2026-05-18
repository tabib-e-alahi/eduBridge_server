import { Lesson, Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';

type LessonResourcePayload = {
  title: string;
  url: string;
};

type LessonFullUpdatePayload = Partial<Lesson> & {
  resources?: LessonResourcePayload[];
};

const createLessonIntoDB = async (payload: any) => {
  const lessonData = {
    ...payload,
    slug: payload.slug || payload.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
  };
  
  const result = await prisma.lesson.create({
    data: lessonData,
  });
  return result;
};

const updateLessonInDB = async (id: string, payload: Partial<Lesson>) => {
  const result = await prisma.lesson.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteLessonFromDB = async (id: string) => {
  const result = await prisma.lesson.delete({
    where: { id },
  });
  return result;
};

const getLessonsByCourseIdFromDB = async (courseId: string) => {
  const result = await prisma.lesson.findMany({
    where: { courseId },
    include: { resources: true },
    orderBy: { order: 'asc' },
  });
  return result;
};

const reorderLessonsInDB = async (courseId: string, lessonIds: string[]) => {
  const lessonsCount = await prisma.lesson.count({
    where: {
      courseId,
      id: { in: lessonIds },
    },
  });

  if (lessonsCount !== lessonIds.length) {
    throw new Error('One or more lessons do not belong to this course');
  }

  const updates = lessonIds.map((id, index) =>
    prisma.lesson.update({
      where: { id },
      data: { order: index + 1 },
    })
  );

  return await prisma.$transaction(updates);
};

const getLessonWithResources = async (lessonId: string) => {
  return prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { resources: true },
  });
};

const updateLessonWithResources = async (id: string, payload: LessonFullUpdatePayload) => {
  const { resources, ...lessonData } = payload;

  const data: Prisma.LessonUpdateInput = {
    ...lessonData,
  };

  if (resources) {
    data.resources = {
      deleteMany: {},
      create: resources.map(resource => ({
        title: resource.title,
        url: resource.url,
      })),
    };
  }

  return prisma.lesson.update({
    where: { id },
    data,
    include: { resources: true },
  });
};

export const LessonService = {
  createLessonIntoDB,
  updateLessonInDB,
  deleteLessonFromDB,
  getLessonsByCourseIdFromDB,
  reorderLessonsInDB,
  getLessonWithResources,
  updateLessonWithResources,
};
