import { z } from 'zod';

const quizQuestionSchema = z.object({
  question: z.string().min(1),
  options: z.array(z.string().min(1)).length(4),
  correctAnswer: z.string().min(1),
  explanation: z.string().optional(),
});

const createQuizZodSchema = z.object({
  body: z.object({
    title: z.string('Quiz title is required').min(1),
    description: z.string().optional(),
    courseId: z.string('Course ID is required'),
    questions: z.array(quizQuestionSchema).min(1),
  }),
});

const updateQuizZodSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    courseId: z.string().optional(),
    questions: z.array(quizQuestionSchema).min(1).optional(),
  }),
});

export const QuizValidations = {
  createQuizZodSchema,
  updateQuizZodSchema,
};
