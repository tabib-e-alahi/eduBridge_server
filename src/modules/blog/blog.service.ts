import { prisma } from '../../lib/prisma';

const createBlogIntoDB = async (payload: any, authorId: string) => {
  const slug = payload.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  const result = await prisma.blog.create({
    data: {
      ...payload,
      authorId,
      slug,
    },
    include: {
      author: {
        select: { name: true, email: true, image: true }
      }
    }
  });
  return result;
};

const getAllBlogsFromDB = async (query: any) => {
  const { searchTerm, authorId, isPublished, sortBy = 'createdAt', sortOrder = 'desc' } = query;
  
  const filter: any = {};
  
  // By default, public should only see published blogs
  if (isPublished !== undefined) {
    filter.isPublished = isPublished === 'true';
  } else {
    filter.isPublished = true;
  }

  if (authorId) {
    filter.authorId = authorId;
  }

  if (searchTerm) {
    filter.OR = [
      { title: { contains: searchTerm, mode: 'insensitive' } },
      { content: { contains: searchTerm, mode: 'insensitive' } },
    ];
  }

  const result = await prisma.blog.findMany({
    where: filter,
    include: {
      author: {
        select: { name: true, email: true, image: true }
      }
    },
    orderBy: {
      [sortBy]: sortOrder
    }
  });

  return result;
};

const getBlogBySlugFromDB = async (slug: string) => {
  const result = await prisma.blog.findUnique({
    where: { slug },
    include: {
      author: {
        select: { name: true, email: true, image: true, role: true }
      }
    }
  });
  return result;
};

const updateBlogInDB = async (id: string, payload: any, authorId: string, role: string) => {
  const blog = await prisma.blog.findUnique({ where: { id } });
  if (!blog) throw new Error('Blog not found');

  if (blog.authorId !== authorId && role !== 'ADMIN') {
    throw new Error('Forbidden: You are not the author of this blog');
  }

  const updateData = { ...payload };
  if (payload.title) {
    updateData.slug = payload.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  }

  const result = await prisma.blog.update({
    where: { id },
    data: updateData,
    include: {
      author: {
        select: { name: true, email: true, image: true }
      }
    }
  });
  return result;
};

const deleteBlogFromDB = async (id: string, authorId: string, role: string) => {
  const blog = await prisma.blog.findUnique({ where: { id } });
  if (!blog) throw new Error('Blog not found');

  if (blog.authorId !== authorId && role !== 'ADMIN') {
    throw new Error('Forbidden: You are not the author of this blog');
  }

  const result = await prisma.blog.delete({
    where: { id }
  });
  return result;
};

const getMyBlogsFromDB = async (authorId: string) => {
  const result = await prisma.blog.findMany({
    where: { authorId },
    include: {
      author: {
        select: { name: true, email: true, image: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  return result;
};

export const BlogService = {
  createBlogIntoDB,
  getAllBlogsFromDB,
  getBlogBySlugFromDB,
  updateBlogInDB,
  deleteBlogFromDB,
  getMyBlogsFromDB,
};
