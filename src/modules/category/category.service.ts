import { prisma } from "../../lib/prisma";


const createCategoryInDB = async (payload: { name: string; slug: string; description?: string; icon?: string }) => {
  const result = await prisma.courseCategory.create({
    data: payload,
  });
  return result;
};

const getAllCategoriesFromDB = async () => {
  const result = await prisma.courseCategory.findMany({
    include: {
      _count: {
        select: { courses: true },
      },
    },
  });
  return result;
};

export const CategoryService = {
  createCategoryInDB,
  getAllCategoriesFromDB,
};
