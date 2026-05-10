import { z } from 'zod';

const learningPathSchema = z.object({
  body: z.object({
    goal: z.string({ required_error: 'Goal is required' }).min(5).max(500),
    currentLevel: z.string({ required_error: 'Current skill level is required' }),
    weeklyHours: z.number().min(1).max(168),
    learningStyle: z.string({ required_error: 'Preferred learning style is required' }),
  }),
});

const courseRecommendationsSchema = z.object({
  body: z.object({
    interests: z.array(z.string()).min(1),
    level: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
  }),
});

const quizGeneratorSchema = z.object({
  body: z.object({
    topic: z.string({ required_error: 'Topic is required' }),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
    count: z.number().min(1).max(20).optional(),
  }),
});

const aiChatSchema = z.object({
  body: z.object({
    message: z.string({ required_error: 'Message is required' }).min(1).max(2000),
    conversationId: z.string().optional(),
    courseContext: z.string().optional(),
  }),
});

const progressAnalyzerSchema = z.object({
  body: z.object({
    enrollments: z.array(z.any()),
    quizScores: z.array(z.any()),
    completedLessons: z.array(z.any()),
    savedCourses: z.array(z.any()),
  }),
});

export const AIValidations = {
  learningPathSchema,
  courseRecommendationsSchema,
  quizGeneratorSchema,
  aiChatSchema,
  progressAnalyzerSchema,
};
