import { Lesson } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';


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
    orderBy: { order: 'asc' },
  });
  return result;
};

export const LessonService = {
  createLessonIntoDB,
  updateLessonInDB,
  deleteLessonFromDB,
  getLessonsByCourseIdFromDB,
};
