import { prisma } from '../../lib/prisma';

const getUserDashboardData = async (userId: string) => {
  const [enrolledCourses, savedCourses, quizAttempts, notifications, recentActivity] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            instructor: { select: { name: true } },
            category: { select: { name: true } },
          },
        },
      },
      take: 7,
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.savedCourse.findMany({
      where: { userId },
      include: { course: true },
      take: 5,
    }),
    prisma.quizAttempt.findMany({
      where: { userId },
      include: {
        quiz: {
          select: {
            title: true,
            course: { select: { title: true } },
          },
        },
      },
      take: 5,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.notification.findMany({
      where: { userId, isRead: false },
      take: 5,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.auditLog.findMany({
      where: { actorId: userId },
      take: 10,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  // Calculate progress summary
  const progressStats = await prisma.enrollment.aggregate({
    where: { userId },
    _avg: { progress: true },
    _count: { id: true },
  });

  // Calculate Quiz Score Trend
  const quizTrend = quizAttempts.map(qa => ({
    date: qa.createdAt.toISOString().split('T')[0],
    score: qa.score
  })).reverse();

  // Weekly Activity (mocking 7 days based on recentActivity)
  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();
  
  const weeklyActivity = last7Days.map(date => {
    const count = recentActivity.filter(a => a.createdAt.toISOString().split('T')[0] === date).length;
    return { date, count };
  });

  return {
    enrolledCourses,
    savedCourses,
    quizAttempts,
    notifications,
    recentActivity,
    stats: {
      averageProgress: progressStats._avg.progress ? Number(progressStats._avg.progress.toFixed(1)) : 0,
      totalEnrolled: progressStats._count.id,
    },
    charts: {
      weeklyActivity,
      quizTrend,
      courseProgress: enrolledCourses.map(e => ({ name: e.course.title.substring(0,15)+'...', progress: e.progress }))
    }
  };
};

const getInstructorDashboardData = async (userId: string) => {
  const [myCourses, recentReviews, totalEnrollments, recentEnrollments, revenueData] = await Promise.all([
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
  getAdminDashboardData,
};
