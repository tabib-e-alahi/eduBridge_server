import { prisma } from '../../lib/prisma';

const getAllUsersFromDB = async () => {
  const result = await prisma.user.findMany();
  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: { id },
    include: { profile: true },
  });
  return result;
};

const getMyProfileFromDB = async (userId: string) => {
  const result = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      profile: true,
    },
  });
  return result;
};

const updateMyProfileInDB = async (userId: string, payload: { name?: string; bio?: string; headline?: string }) => {
  // Update user name if provided
  if (payload.name) {
    await prisma.user.update({
      where: { id: userId },
      data: { name: payload.name },
    });
  }

  // Upsert profile data
  const profileData: any = {};
  if (payload.bio !== undefined) profileData.bio = payload.bio;
  if (payload.headline !== undefined) profileData.headline = payload.headline;

  if (Object.keys(profileData).length > 0) {
    await prisma.profile.upsert({
      where: { userId },
      update: profileData,
      create: { userId, ...profileData },
    });
  }

  return getMyProfileFromDB(userId);
};

const updateInstructorProfile = async (userId: string, payload: any) => {
  const {
    displayName,
    name,
    bio,
    expertise,
    websiteUrl,
    linkedinUrl,
    youtubeUrl,
    avatarUrl,
    avatarPublicId,
    headline,
    location,
    isPublic,
  } = payload;

  if (displayName || name) {
    await prisma.user.update({
      where: { id: userId },
      data: { name: displayName || name },
    });
  }

  const profileData: any = {};
  if (bio !== undefined) profileData.bio = bio;
  if (headline !== undefined) profileData.headline = headline;
  if (expertise !== undefined) profileData.expertise = expertise;
  if (websiteUrl !== undefined) profileData.websiteUrl = websiteUrl;
  if (linkedinUrl !== undefined) profileData.linkedinUrl = linkedinUrl;
  if (youtubeUrl !== undefined) profileData.youtubeUrl = youtubeUrl;
  if (avatarUrl !== undefined) profileData.avatarUrl = avatarUrl;
  if (avatarPublicId !== undefined) profileData.avatarPublicId = avatarPublicId;
  if (location !== undefined) profileData.location = location;
  if (isPublic !== undefined) profileData.isPublic = isPublic;

  if (Object.keys(profileData).length > 0) {
    await prisma.profile.upsert({
      where: { userId },
      update: profileData,
      create: {
        userId,
        skills: [],
        expertise: expertise || [],
        ...profileData,
      },
    });
  }

  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      profile: true,
      courses: {
        select: {
          id: true,
          reviews: { select: { rating: true } },
          _count: { select: { enrollments: true } },
        },
      },
    },
  });
};

const getStudentProgressForInstructor = async (instructorId: string, studentId: string) => {
  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId: studentId,
      course: { instructorId },
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          thumbnailUrl: true,
          completionCriteria: true,
        },
      },
      lessonProgress: {
        include: {
          lesson: {
            select: {
              id: true,
              title: true,
              order: true,
              duration: true,
            },
          },
        },
        orderBy: { lesson: { order: 'asc' } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!enrollments.length) {
    throw new Error('Student not found in your courses');
  }

  const student = await prisma.user.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
    },
  });

  const quizAttempts = await prisma.quizAttempt.findMany({
    where: {
      userId: studentId,
      quiz: { course: { instructorId } },
    },
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

  const submissions = await prisma.assignmentSubmission.findMany({
    where: {
      studentId,
      assignment: { course: { instructorId } },
    },
    include: {
      assignment: {
        select: {
          title: true,
          course: { select: { title: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const averageProgress =
    enrollments.length > 0
      ? enrollments.reduce((sum, enrollment) => sum + enrollment.progress, 0) / enrollments.length
      : 0;

  return {
    student,
    summary: {
      totalCourses: enrollments.length,
      averageProgress: Number(averageProgress.toFixed(1)),
      quizzesTaken: quizAttempts.length,
      assignmentsSubmitted: submissions.length,
    },
    enrollments,
    quizAttempts,
    submissions,
  };
};

export const UserService = {
  getAllUsersFromDB,
  getSingleUserFromDB,
  getMyProfileFromDB,
  updateMyProfileInDB,
  updateInstructorProfile,
  getStudentProgressForInstructor,
};
