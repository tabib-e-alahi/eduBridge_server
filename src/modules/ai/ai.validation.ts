import { z } from 'zod';

const learningPathSchema = z.object({
  body: z.object({
    goal: z.string( 'Goal is required').min(5).max(500),
    currentLevel: z.string( 'Current skill level is required'),
    weeklyHours: z.number().min(1).max(168),
    learningStyle: z.string( 'Preferred learning style is required'),
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
    topic: z.string('Topic is required'),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
    count: z.number().min(1).max(20).optional(),
    courseId: z.string().optional(),
    saveToDb: z.boolean().optional(),
  }),
});

const courseOutlineSchema = z.object({
  body: z.object({
    topic: z.string('Topic is required').min(1),
    targetAudience: z.string('Target audience is required').min(1),
    durationWeeks: z.number().min(1).max(52).optional(),
    level: z.string().optional(),
  }),
});

const lessonDescriptionSchema = z.object({
  body: z.object({
    lessonTitle: z.string('Lesson title is required').min(1),
    keyConcepts: z.string('Key concepts are required').min(1),
  }),
});

const aiChatSchema = z.object({
  body: z.object({
    message: z.string( 'Message is required').min(1).max(2000),
    conversationId: z.string().optional(),
    courseContext: z.string().optional(),
  }),
});

const progressAnalyzerSchema = z.object({
  body: z.object({}).optional(),
});

export const AIValidations = {
  learningPathSchema,
  courseRecommendationsSchema,
  quizGeneratorSchema,
  courseOutlineSchema,
  lessonDescriptionSchema,
  aiChatSchema,
  progressAnalyzerSchema,
};
