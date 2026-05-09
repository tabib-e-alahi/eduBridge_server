import { prisma } from '../../lib/prisma';

const getUserDashboardData = async (userId: string) => {
  const [
    enrolledCourses,
    savedCourses,
    quizAttempts,
    notifications,
    assignments,
    upcomingClasses,
  ] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            instructor: { select: { name: true } },
            category: { select: { name: true } },
            lessons: { select: { id: true, duration: true } },
          },
        },
        lessonProgress: {
          where: { isCompleted: true },
          select: { completedAt: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.savedCourse.findMany({
      where: { userId },
      include: { course: true },
      take: 5,
    }),
    prisma.quizAttempt.findMany({
      where: { userId },
      include: { quiz: { select: { title: true, course: { select: { title: true } } } } },
      take: 10,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.notification.findMany({
      where: { userId, isRead: false },
      take: 5,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.assignment.findMany({
      where: {
        course: { enrollments: { some: { userId } } },
        dueDate: { gte: new Date() },
        submissions: { none: { studentId: userId } },
      },
      include: { course: { select: { title: true } } },
      orderBy: { dueDate: 'asc' },
      take: 5,
    }),
    prisma.liveClass.findMany({
      where: {
        course: { enrollments: { some: { userId } } },
        startTime: { gte: new Date() },
      },
      include: {
        course: {
          select: {
            title: true,
            instructor: { select: { name: true } },
          },
        },
      },
      orderBy: { startTime: 'asc' },
      take: 5,
    }),
  ]);

  const toIsoDate = (d: Date) => d.toISOString().split('T')[0];

  // Completed lesson timestamps (for all courses)
  const allCompletedAt: Date[] = enrolledCourses.flatMap((e) =>
    e.lessonProgress.map((lp) => lp.completedAt).filter((d): d is Date => Boolean(d))
  );

  // Compute REAL study hours from weekly lesson completions (estimate: 15min per completion)
  const thisWeekStart = new Date();
  thisWeekStart.setDate(thisWeekStart.getDate() - 7);
  const thisWeekCompletions = allCompletedAt.filter((d) => d >= thisWeekStart).length;
  const studyHoursThisWeek = Number((thisWeekCompletions * 0.25).toFixed(1));

  // Weekly activity chart (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return toIsoDate(d);
  });

  const weeklyActivity = last7Days.map((date) => ({
    date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
    lessons: allCompletedAt.filter((d) => toIsoDate(d) === date).length,
  }));

  // Quiz score trend
  const quizTrend = quizAttempts
    .slice()
    .reverse()
    .map((qa) => ({
      date: new Date(qa.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: Math.round(qa.score),
    }));

  // Learning streak (consecutive days with >= 1 lesson completed)
  const uniqueDatesDesc = [...new Set(allCompletedAt.map(toIsoDate))].sort().reverse();
  let streak = 0;
  for (let i = 0; i < uniqueDatesDesc.length; i++) {
    const expected = new Date();
    expected.setDate(expected.getDate() - i);
    if (uniqueDatesDesc[i] === toIsoDate(expected)) {
      streak++;
    } else {
      break;
    }
  }

  // Real announcements
  const announcements = await prisma.notification.findMany({
    where: { userId, type: 'ANNOUNCEMENT' },
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  const progressStats = await prisma.enrollment.aggregate({
    where: { userId },
    _avg: { progress: true },
    _count: { id: true },
  });

  return {
    enrolledCourses,
    savedCourses,
    quizAttempts,
    notifications,
    assignments,
    upcomingClasses,
    announcements,
    stats: {
      averageProgress: progressStats._avg.progress ? Number(progressStats._avg.progress.toFixed(1)) : 0,
      totalEnrolled: progressStats._count.id,
      studyHoursThisWeek,
      learningStreak: streak,
      quizzesPassed: quizAttempts.filter((qa) => qa.score >= 70).length,
      pendingAssignments: assignments.length,
    },
    charts: {
      weeklyActivity,
      quizTrend,
      courseProgress: enrolledCourses.map((e) => ({
        name: e.course.title.substring(0, 15) + '...',
        progress: e.progress,
      })),
    },
  };
};

const getInstructorDashboardData = async (userId: string) => {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [
    myCourses,
    recentReviews,
    totalEnrollments,
    recentEnrollments,
    revenueData,
    currentMonthRevenue,
    lastMonthRevenue,
    currentMonthStudents,
    lastMonthStudents,
    currentMonthReviews,
    lastMonthReviews,
    currentMonthRating,
    lastMonthRating,
    atRiskCount,
    profile,
    aiUsageCount,
  ] = await Promise.all([
    prisma.course.findMany({
      where: { instructorId: userId },
      include: {
        _count: { select: { enrollments: true, reviews: true } },
        reviews: { select: { rating: true } },
      },
    }),
    prisma.review.findMany({
      where: { course: { instructorId: userId } },
      include: { 
        user: { select: { name: true, image: true } }, 
        course: { select: { title: true } } 
      },
      take: 5,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.enrollment.count({
      where: { course: { instructorId: userId } },
    }),
    prisma.enrollment.findMany({
      where: { course: { instructorId: userId } },
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } },
      },
      take: 5,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.aggregate({
      where: { 
        course: { instructorId: userId },
        status: 'SUCCESS'
      },
      _sum: { amount: true },
    }),
    prisma.order.aggregate({
      where: {
        course: { instructorId: userId },
        status: 'SUCCESS',
        createdAt: { gte: currentMonthStart, lt: nextMonthStart },
      },
      _sum: { amount: true },
    }),
    prisma.order.aggregate({
      where: {
        course: { instructorId: userId },
        status: 'SUCCESS',
        createdAt: { gte: lastMonthStart, lt: currentMonthStart },
      },
      _sum: { amount: true },
    }),
    prisma.enrollment.count({
      where: {
        course: { instructorId: userId },
        createdAt: { gte: currentMonthStart, lt: nextMonthStart },
      },
    }),
    prisma.enrollment.count({
      where: {
        course: { instructorId: userId },
        createdAt: { gte: lastMonthStart, lt: currentMonthStart },
      },
    }),
    prisma.review.count({
      where: {
        course: { instructorId: userId },
        createdAt: { gte: currentMonthStart, lt: nextMonthStart },
      },
    }),
    prisma.review.count({
      where: {
        course: { instructorId: userId },
        createdAt: { gte: lastMonthStart, lt: currentMonthStart },
      },
    }),
    prisma.review.aggregate({
      where: {
        course: { instructorId: userId },
        createdAt: { gte: currentMonthStart, lt: nextMonthStart },
      },
      _avg: { rating: true },
    }),
    prisma.review.aggregate({
      where: {
        course: { instructorId: userId },
        createdAt: { gte: lastMonthStart, lt: currentMonthStart },
      },
      _avg: { rating: true },
    }),
    prisma.enrollment.count({
      where: {
        course: { instructorId: userId },
        progress: { lt: 10 },
      },
    }),
    prisma.profile.findUnique({
      where: { userId },
      select: { id: true, bio: true, expertise: true },
    }),
    prisma.aIRequestLog.count({
      where: { userId },
    }),
  ]);

  // Calculate average rating across all courses
  let totalRating = 0;
  let totalReviewCount = 0;
  myCourses.forEach(course => {
    const courseRatingSum = course.reviews.reduce((sum, r) => sum + r.rating, 0);
    totalRating += courseRatingSum;
    totalReviewCount += course.reviews.length;
  });
  const avgRating = totalReviewCount > 0 ? totalRating / totalReviewCount : 0;

  // Monthly enrollments (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyEnrollments = await prisma.$queryRaw`
    SELECT 
      TO_CHAR(e."createdAt", 'Mon YYYY') as month,
      COUNT(e.id)::int as count
    FROM "Enrollment" e
    JOIN "Course" c ON e."courseId" = c.id
    WHERE c."instructorId" = ${userId} AND e."createdAt" >= ${sixMonthsAgo}
    GROUP BY month
    ORDER BY MIN(e."createdAt")
  `;

  // Rating distribution
  const ratingDist = [1, 2, 3, 4, 5].map(star => {
    let count = 0;
    myCourses.forEach(c => {
      count += c.reviews.filter(r => Math.round(r.rating) === star).length;
    });
    return { name: `${star} Star`, count };
  });

  // Calculate real completion rate from enrollment progress
  const completionData = await Promise.all(myCourses.map(async (c) => {
    const stats = await prisma.enrollment.aggregate({
      where: { courseId: c.id },
      _avg: { progress: true },
    });
    return {
      name: c.title.substring(0, 10) + '...',
      rate: Math.round(stats._avg.progress || 0),
    };
  }));

  return {
    courses: myCourses,
    recentReviews,
    recentEnrollments,
    stats: {
      totalCourses: myCourses.length,
      totalStudents: totalEnrollments,
      avgRating: Number(avgRating.toFixed(1)),
      totalReviews: totalReviewCount,
      totalRevenue: revenueData._sum.amount || 0,
      comparisons: {
        revenue: {
          currentMonth: currentMonthRevenue._sum.amount || 0,
          lastMonth: lastMonthRevenue._sum.amount || 0,
        },
        students: {
          currentMonth: currentMonthStudents,
          lastMonth: lastMonthStudents,
        },
        reviews: {
          currentMonth: currentMonthReviews,
          lastMonth: lastMonthReviews,
        },
        rating: {
          currentMonth: Number((currentMonthRating._avg.rating || 0).toFixed(1)),
          lastMonth: Number((lastMonthRating._avg.rating || 0).toFixed(1)),
        },
      },
      atRiskCount,
      onboarding: {
        hasProfile: Boolean(profile?.bio || profile?.expertise?.length),
        hasCourse: myCourses.length > 0,
        hasAIExplored: aiUsageCount > 0,
      },
    },
    coursePerformance: myCourses.map(c => {
      const rating = c.reviews.length > 0 
        ? c.reviews.reduce((sum, r) => sum + r.rating, 0) / c.reviews.length 
        : 0;
      return {
        id: c.id,
        title: c.title,
        enrollments: c._count.enrollments,
        rating: Number(rating.toFixed(1)),
      };
    }),
    charts: {
      monthlyEnrollments,
      ratingDistribution: ratingDist,
      completionRates: completionData
    }
  };
};

const getInstructorEarningsData = async (userId: string) => {
  const orders = await prisma.order.findMany({
    where: {
      course: { instructorId: userId },
      status: 'SUCCESS',
    },
    include: {
      course: { select: { id: true, title: true, price: true, status: true } },
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const PLATFORM_FEE = 0.2;
  const totalGross = orders.reduce((sum, order) => sum + order.amount, 0);
  const totalNet = totalGross * (1 - PLATFORM_FEE);
  const now = new Date();

  const thisMonthGross = orders
    .filter(order => {
      const orderDate = new Date(order.createdAt);
      return (
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, order) => sum + order.amount, 0);

  const monthlyEarnings = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (11 - index), 1);
    const monthOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return (
        orderDate.getMonth() === date.getMonth() &&
        orderDate.getFullYear() === date.getFullYear()
      );
    });
    const gross = monthOrders.reduce((sum, order) => sum + order.amount, 0);

    return {
      month: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
      gross: Number(gross.toFixed(2)),
      net: Number((gross * (1 - PLATFORM_FEE)).toFixed(2)),
    };
  });

  const courseMap = new Map<
    string,
    { title: string; price: number; students: number; gross: number; status: string }
  >();

  for (const order of orders) {
    if (!courseMap.has(order.courseId)) {
      courseMap.set(order.courseId, {
        title: order.course.title,
        price: order.course.price,
        students: 0,
        gross: 0,
        status: order.course.status,
      });
    }

    const course = courseMap.get(order.courseId);
    if (course) {
      course.students += 1;
      course.gross += order.amount;
    }
  }

  const courseEarnings = Array.from(courseMap.values()).map(course => ({
    ...course,
    gross: Number(course.gross.toFixed(2)),
    fee: Number((course.gross * PLATFORM_FEE).toFixed(2)),
    net: Number((course.gross * (1 - PLATFORM_FEE)).toFixed(2)),
  }));

  return {
    stats: {
      totalGross: Number(totalGross.toFixed(2)),
      totalNet: Number(totalNet.toFixed(2)),
      thisMonthGross: Number(thisMonthGross.toFixed(2)),
      thisMonthNet: Number((thisMonthGross * (1 - PLATFORM_FEE)).toFixed(2)),
      pendingPayouts: Number(totalNet.toFixed(2)),
      platformFeePercent: PLATFORM_FEE * 100,
    },
    monthlyEarnings,
    courseEarnings,
    recentTransactions: orders.slice(0, 50).map(order => ({
      studentName: order.user.name,
      studentEmail: order.user.email,
      courseTitle: order.course.title,
      amount: order.amount,
      date: order.createdAt,
      status: order.status,
    })),
  };
};

const getAdminDashboardData = async () => {
  const [
    totalUsers,
    totalCourses,
    totalEnrollments,
    totalReviews,
    avgRating,
    categoryDistribution,
    roleDistribution,
    recentUsers,
    recentEnrollments,
    aiLogs,
    topCourses,
    pendingInstructorsCount,
    totalAIRequestsCount
  ] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.enrollment.count(),
    prisma.review.count(),
    prisma.review.aggregate({ _avg: { rating: true } }),
    prisma.courseCategory.findMany({
      include: { _count: { select: { courses: true } } },
    }),
    prisma.user.groupBy({
      by: ['role'],
      _count: { id: true },
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    }),
    prisma.enrollment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } }, course: { select: { title: true } } }
    }),
    prisma.aIRequestLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } }
    }),
    prisma.course.findMany({
      take: 5,
      orderBy: { enrollments: { _count: 'desc' } },
      include: { _count: { select: { enrollments: true } } }
    }),
    prisma.user.count({
      where: { role: 'INSTRUCTOR', status: 'PENDING_APPROVAL' }
    }),
    prisma.aIRequestLog.count()
  ]);

  // Monthly enrollment chart (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyEnrollments = await prisma.$queryRaw`
    SELECT 
      TO_CHAR("createdAt", 'Mon YYYY') as month,
      COUNT(id)::int as count
    FROM "Enrollment"
    WHERE "createdAt" >= ${sixMonthsAgo}
    GROUP BY month
    ORDER BY MIN("createdAt")
  `;

  // Simulated Monthly Revenue
  const monthlyRevenue = await prisma.$queryRaw`
    SELECT 
      TO_CHAR("createdAt", 'Mon YYYY') as month,
      SUM(amount)::int as revenue
    FROM "Order"
    WHERE "createdAt" >= ${sixMonthsAgo} AND status = 'SUCCESS'
    GROUP BY month
    ORDER BY MIN("createdAt")
  `;

  // AI Usage by Feature — real data from AIRequestLog
  const aiUsageRaw = await prisma.aIRequestLog.groupBy({
    by: ['feature'],
    _count: { id: true },
  });
  const aiUsage = aiUsageRaw.map(item => ({
    feature: item.feature,
    count: item._count.id,
  }));

  return {
    stats: {
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalReviews,
      avgRating: avgRating._avg.rating ? Number(avgRating._avg.rating.toFixed(1)) : 0,
      pendingInstructors: pendingInstructorsCount,
      totalAIRequests: totalAIRequestsCount,
    },
    charts: {
      categoryDistribution: categoryDistribution.map(c => ({ name: c.name, count: c._count.courses })),
      roleDistribution: roleDistribution.map(r => ({ role: r.role, count: r._count.id })),
      monthlyEnrollments,
      monthlyRevenue,
      aiUsage
    },
    recentUsers,
    recentEnrollments,
    aiLogs,
    topCourses: topCourses.map(c => ({
      ...c,
      enrolledCount: c._count.enrollments
    })),
  };
};

export const DashboardService = {
  getUserDashboardData,
  getInstructorDashboardData,
  getInstructorEarningsData,
  getAdminDashboardData,
};
