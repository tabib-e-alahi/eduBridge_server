import { z } from 'zod';

const createCourseZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    slug: z.string({ required_error: 'Slug is required' }),
    description: z.string({ required_error: 'Description is required' }),
    price: z.number().min(0).default(0),
    level: z.string().default('Beginner'),
    categoryId: z.string({ required_error: 'Category ID is required' }),
    instructorId: z.string().optional(),
    thumbnailUrl: z.string().optional(),
    duration: z.string().optional(),
    lessons: z.array(z.object({
      title: z.string(),
      duration: z.string().optional(),
    })).optional(),
  }),
});

const updateCourseZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    price: z.number().min(0).optional(),
    level: z.string().optional(),
    categoryId: z.string().optional(),
    instructorId: z.string().optional(),
    thumbnailUrl: z.string().optional(),
    duration: z.string().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  }),
});

export const CourseValidations = {
  createCourseZodSchema,
  updateCourseZodSchema,
};
