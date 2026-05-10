import { z } from 'zod';

const createLessonZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    content: z.string().optional(),
    videoUrl: z.string().optional(),
    duration: z.string().optional(),
    order: z.number().int().min(1),
    courseId: z.string({ required_error: 'Course ID is required' }),
  }),
});

const updateLessonZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    videoUrl: z.string().optional(),
    duration: z.string().optional(),
    order: z.number().int().min(1).optional(),
  }),
});

const reorderLessonsZodSchema = z.object({
  body: z.object({
    lessons: z.array(
      z.object({
        id: z.string(),
        order: z.number().int().min(0),
      })
    ),
  }),
});

export const LessonValidations = {
  createLessonZodSchema,
  updateLessonZodSchema,
  reorderLessonsZodSchema,
};
