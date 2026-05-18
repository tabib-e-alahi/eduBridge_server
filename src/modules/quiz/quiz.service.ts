import { Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';

type QuizQuestionPayload = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string | null;
};

type QuizPayload = {
  title: string;
  description?: string | null;
  courseId: string;
  questions?: QuizQuestionPayload[];
};

const normalizeQuestions = (questions: QuizQuestionPayload[] = []) =>
  questions.map(question => ({
    question: question.question,
    options: question.options as Prisma.InputJsonValue,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation ?? null,
  }));

const createQuizInDB = async (payload: QuizPayload) => {
  const { questions = [], ...quizData } = payload;

  return prisma.quiz.create({
    data: {
      ...quizData,
      questions: {
        create: normalizeQuestions(questions),
      },
    },
    include: {
      questions: true,
      _count: { select: { attempts: true } },
    },
  });
};

const getQuizzesByCourseId = async (courseId: string) => {
  return prisma.quiz.findMany({
    where: { courseId },
    include: {
      questions: true,
      _count: { select: { questions: true, attempts: true } },
      attempts: {
        select: {
          score: true,
          totalQuestions: true,
          userId: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

const updateQuizInDB = async (id: string, payload: Partial<QuizPayload>) => {
  const { questions, ...quizData } = payload;
  const data: Prisma.QuizUpdateInput = { ...quizData };

  if (questions) {
    data.questions = {
      deleteMany: {},
      create: normalizeQuestions(questions),
    };
  }

  return prisma.quiz.update({
    where: { id },
    data,
    include: { questions: true },
  });
};

const deleteQuizFromDB = async (id: string) => {
  return prisma.quiz.delete({ where: { id } });
};

const getQuizResults = async (id: string) => {
  return prisma.quiz.findUnique({
    where: { id },
    include: {
      attempts: {
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
      _count: { select: { questions: true, attempts: true } },
    },
  });
};

export const QuizService = {
  createQuizInDB,
  getQuizzesByCourseId,
  updateQuizInDB,
  deleteQuizFromDB,
  getQuizResults,
};
