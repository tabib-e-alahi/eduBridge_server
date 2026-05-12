import { prisma } from '../../lib/prisma';

const getAllMentorsFromDB = async () => {
  const result = await prisma.mentor.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          role: true,
        },
      },
    },
  });
  return result;
};

const getMentorDetailsFromDB = async (id: string) => {
  const result = await prisma.mentor.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          courses: {
            where: { status: 'PUBLISHED' },
            select: { id: true, title: true, thumbnailUrl: true },
          },
        },
      },
    },
  });
  return result;
};

export const MentorService = {
  getAllMentorsFromDB,
  getMentorDetailsFromDB,
};
