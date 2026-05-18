import { z } from 'zod';

const createLessonZodSchema = z.object({
  body: z.object({
    title: z.string('Title is required'),
    content: z.string().optional(),
    videoUrl: z.string().optional(),
    duration: z.string().optional(),
    order: z.number().int().min(1),
    courseId: z.string('Course ID is required'),
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
    courseId: z.string('Course ID is required'),
    lessonIds: z.array(z.string()).min(1),
  }),
});

const updateLessonFullZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    slug: z.string().optional(),
    content: z.string().optional(),
    videoUrl: z.string().optional(),
    duration: z.string().optional(),
    order: z.number().int().min(1).optional(),
    isFree: z.boolean().optional(),
    isPublished: z.boolean().optional(),
    resources: z
      .array(
        z.object({
          title: z.string().min(1),
          url: z.string().min(1),
        })
      )
      .optional(),
  }),
});

export const LessonValidations = {
  createLessonZodSchema,
  updateLessonZodSchema,
  reorderLessonsZodSchema,
  updateLessonFullZodSchema,
};
