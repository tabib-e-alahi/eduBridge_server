import { prisma } from '../../lib/prisma';

const enrollInCourseInDB = async (userId: string, courseId: string) => {
  const result = await prisma.enrollment.create({
    data: {
      userId,
      courseId,
      status: 'ACTIVE',
    },
    include: {
      course: true,
      user: true,
    }
  });

  // Send notification & email (async, don't block response)
  const NotificationService = (await import('../notification/notification.service')).default;
  const EmailService = (await import('../../lib/email')).default;
  
  NotificationService.notifyEnrollmentSuccess(userId, result.course.title);
  EmailService.sendEnrollmentConfirmation(result.user.email, result.user.name || 'Learner', result.course.title);

  return result;
};

const getMyEnrollmentsFromDB = async (userId: string) => {
  const result = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          instructor: { select: { name: true } },
          category: true,
        },
      },
    },
  });
  return result;
};

const updateProgressInDB = async (enrollmentId: string, lessonId: string, isCompleted: boolean) => {
  // 1. Update or create lesson progress
  await prisma.lessonProgress.upsert({
    where: {
      enrollmentId_lessonId: {
        enrollmentId,
        lessonId,
      },
    },
    update: {
      isCompleted,
      completedAt: isCompleted ? new Date() : null,
    },
    create: {
      enrollmentId,
      lessonId,
      isCompleted,
      completedAt: isCompleted ? new Date() : null,
    },
  });

  // 2. Recalculate total progress
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      course: {
        include: { lessons: true },
      },
      lessonProgress: {
        where: { isCompleted: true },
      },
    },
  });

  if (!enrollment) throw new Error('Enrollment not found');

  const totalLessons = enrollment.course.lessons.length;
  const completedLessons = enrollment.lessonProgress.length;
  const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  // 3. Update enrollment with new progress and last accessed lesson
  const result = await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: {
      progress,
      lastAccessedLessonId: lessonId,
      status: progress === 100 ? 'COMPLETED' : 'ACTIVE',
    },
  });

  return result;
};

const getCourseProgressFromDB = async (userId: string, courseIdentifier: string) => {
  // First, find the course to get its ID if a slug was provided
  const course = await prisma.course.findFirst({
    where: {
      OR: [
        { id: courseIdentifier },
        { slug: courseIdentifier }
      ]
    }
  });

  if (!course) {
    return null;
  }

  const result = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
    include: {
      lessonProgress: true,
      course: {
        include: {
          lessons: {
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });

  return result;
};

const getLearningSummaryFromDB = async (userId: string) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        select: { title: true, thumbnailUrl: true },
      },
    },
  });

  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter(e => e.progress === 100).length;
  const averageProgress = totalCourses > 0 
    ? enrollments.reduce((acc, curr) => acc + curr.progress, 0) / totalCourses 
    : 0;

  return {
    totalCourses,
    completedCourses,
    averageProgress,
    recentEnrollments: enrollments.slice(0, 5),
  };
};

const getUserQuizzesFromDB = async (userId: string) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    select: { courseId: true },
  });

  const courseIds = enrollments.map(e => e.courseId);

  const quizzes = await prisma.quiz.findMany({
    where: { courseId: { in: courseIds } },
    include: {
      course: { select: { title: true } },
      _count: { select: { questions: true, attempts: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return quizzes;
};

const getUserQuizAttemptsFromDB = async (userId: string) => {
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId },
    include: {
      quiz: {
        select: {
          title: true,
          course: { select: { title: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return attempts;
};

const getQuizDetailsFromDB = async (userId: string, quizId: string) => {
  // Find quiz and its associated course
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      course: true,
      questions: true,
    },
  });

  if (!quiz) {
    throw new Error('Quiz not found');
  }

  // Verify that the user is enrolled in the course associated with the quiz
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: quiz.courseId,
      },
    },
  });

  if (!enrollment) {
    throw new Error('You are not enrolled in the course associated with this quiz');
  }

  return quiz;
};

const submitQuizAttemptInDB = async (userId: string, quizId: string, userAnswers: Record<string, string>) => {
  // Fetch quiz with questions
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { questions: true },
  });

  if (!quiz) {
    throw new Error('Quiz not found');
  }

  let correctCount = 0;
  const totalQuestions = quiz.questions.length;

  // Calculate score
  quiz.questions.forEach((q) => {
    if (userAnswers[q.id] === q.correctAnswer) {
      correctCount++;
    }
  });

  const score = (correctCount / totalQuestions) * 100;

  // Create attempt
  const result = await prisma.quizAttempt.create({
    data: {
      userId,
      quizId,
      score,
      totalQuestions,
      answers: userAnswers as any,
      status: score >= 70 ? 'COMPLETED' : 'FAILED', // Example threshold
    },
    include: {
      quiz: {
        select: {
          title: true,
          course: { select: { title: true } },
        },
      },
    },
  });

  return result;
};

const getInstructorStudentsFromDB = async (instructorId: string) => {
  const result = await prisma.enrollment.findMany({
    where: {
      course: {
        instructorId
      }
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true
        }
      },
      course: {
        select: {
          title: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return result;
};

export const EnrollmentService = {
  enrollInCourseInDB,
  getMyEnrollmentsFromDB,
  getInstructorStudentsFromDB,
  updateProgressInDB,
  getCourseProgressFromDB,
  getLearningSummaryFromDB,
  getUserQuizzesFromDB,
  getUserQuizAttemptsFromDB,
  getQuizDetailsFromDB,
  submitQuizAttemptInDB,
};
