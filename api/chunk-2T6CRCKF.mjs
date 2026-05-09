import {
  prisma
} from "./chunk-W7XWHOM4.mjs";

// src/modules/notification/notification.service.ts
var NotificationService = {
  /**
   * Create a single notification for a user.
   */
  async create(data) {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type
      }
    });
  },
  /**
   * Create notifications for multiple users (broadcast).
   */
  async broadcast(userIds, title, message, type) {
    return prisma.notification.createMany({
      data: userIds.map((userId) => ({
        userId,
        title,
        message,
        type
      }))
    });
  },
  /**
   * Create an admin announcement for ALL users.
   */
  async createAnnouncement(title, message) {
    const users = await prisma.user.findMany({ select: { id: true } });
    const userIds = users.map((u) => u.id);
    return this.broadcast(userIds, title, message, "admin_announcement");
  },
  /**
   * Send a course announcement to every active student in an instructor-owned course.
   */
  async sendCourseAnnouncement(instructorId, courseId, payload) {
    const course = await prisma.course.findFirst({
      where: { id: courseId, instructorId },
      select: { id: true, title: true }
    });
    if (!course) {
      throw new Error("Course not found");
    }
    const enrollments = await prisma.enrollment.findMany({
      where: { courseId, status: "ACTIVE" },
      select: { userId: true }
    });
    const notifications = enrollments.map((enrollment) => ({
      userId: enrollment.userId,
      title: `${course.title}: ${payload.title}`,
      message: payload.message,
      type: "ANNOUNCEMENT"
    }));
    if (!notifications.length) {
      return { sent: 0 };
    }
    await prisma.notification.createMany({ data: notifications });
    return { sent: notifications.length };
  },
  /**
   * Get notifications for a user with pagination.
   */
  async getMyNotifications(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma.notification.count({ where: { userId } }),
      prisma.notification.count({ where: { userId, isRead: false } })
    ]);
    return {
      notifications,
      unreadCount,
      meta: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit)
      }
    };
  },
  /**
   * Get unread count for a user.
   */
  async getUnreadCount(userId) {
    return prisma.notification.count({
      where: { userId, isRead: false }
    });
  },
  /**
   * Mark a single notification as read.
   */
  async markAsRead(notificationId, userId) {
    return prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true }
    });
  },
  /**
   * Mark all notifications as read for a user.
   */
  async markAllAsRead(userId) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });
  },
  /**
   * Delete a notification.
   */
  async delete(notificationId, userId) {
    return prisma.notification.deleteMany({
      where: { id: notificationId, userId }
    });
  },
  // ─── Contextual notification helpers ───────────────────────
  async notifyEnrollmentSuccess(userId, courseTitle) {
    return this.create({
      userId,
      title: "Enrollment Successful",
      message: `You have been enrolled in "${courseTitle}". Start learning now!`,
      type: "enrollment_success"
    });
  },
  async notifyQuizCompleted(userId, quizTitle, score) {
    return this.create({
      userId,
      title: "Quiz Completed",
      message: `You scored ${score}% on "${quizTitle}". ${score >= 80 ? "Excellent work!" : "Keep practicing!"}`,
      type: "quiz_completed"
    });
  },
  async notifyLearningPathGenerated(userId, pathTitle) {
    return this.create({
      userId,
      title: "Learning Path Generated",
      message: `Your AI learning path "${pathTitle}" is ready. Start your journey!`,
      type: "learning_path_generated"
    });
  },
  async notifyCertificateIssued(userId, courseTitle) {
    return this.create({
      userId,
      title: "Certificate Earned",
      message: `Congratulations! You've completed "${courseTitle}" and earned your certificate.`,
      type: "certificate_issued"
    });
  },
  async notifyNewCoursePublished(courseTitle) {
    const users = await prisma.user.findMany({ select: { id: true } });
    const userIds = users.map((u) => u.id);
    return this.broadcast(
      userIds,
      "New Course Available",
      `A new course "${courseTitle}" has been published. Check it out!`,
      "course_published"
    );
  },
  async notifyReviewSubmitted(instructorId, courseTitle, rating) {
    return this.create({
      userId: instructorId,
      title: "New Review",
      message: `A student left a ${rating}-star review on "${courseTitle}".`,
      type: "review_submitted"
    });
  }
};
var notification_service_default = NotificationService;

export {
  notification_service_default
};
