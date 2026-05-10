import { prisma } from '../../lib/prisma';

export type NotificationType =
  | 'enrollment_success'
  | 'progress_update'
  | 'quiz_completed'
  | 'learning_path_generated'
  | 'course_published'
  | 'review_submitted'
  | 'admin_announcement'
  | 'course_approval'
  | 'account_security';

interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
}

const NotificationService = {
  /**
   * Create a single notification for a user.
   */
  async create(data: CreateNotificationInput) {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type,
      },
    });
  },

  /**
   * Create notifications for multiple users (broadcast).
   */
  async broadcast(userIds: string[], title: string, message: string, type: NotificationType) {
    return prisma.notification.createMany({
      data: userIds.map((userId) => ({
        userId,
        title,
        message,
        type,
      })),
    });
  },

  /**
   * Create an admin announcement for ALL users.
   */
  async createAnnouncement(title: string, message: string) {
    const users = await prisma.user.findMany({ select: { id: true } });
    const userIds = users.map((u) => u.id);
    return this.broadcast(userIds, title, message, 'admin_announcement');
  },

  /**
   * Get notifications for a user with pagination.
   */
  async getMyNotifications(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where: { userId } }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return {
      notifications,
      unreadCount,
      meta: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Get unread count for a user.
   */
  async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: { userId, isRead: false },
    });
  },

  /**
   * Mark a single notification as read.
   */
  async markAsRead(notificationId: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  },

  /**
   * Mark all notifications as read for a user.
   */
  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  },

  /**
   * Delete a notification.
   */
  async delete(notificationId: string, userId: string) {
    return prisma.notification.deleteMany({
      where: { id: notificationId, userId },
    });
  },

  // ─── Contextual notification helpers ───────────────────────

  async notifyEnrollmentSuccess(userId: string, courseTitle: string) {
    return this.create({
      userId,
      title: 'Enrollment Successful',
      message: `You have been enrolled in "${courseTitle}". Start learning now!`,
      type: 'enrollment_success',
    });
  },

  async notifyQuizCompleted(userId: string, quizTitle: string, score: number) {
    return this.create({
      userId,
      title: 'Quiz Completed',
      message: `You scored ${score}% on "${quizTitle}". ${score >= 80 ? 'Excellent work!' : 'Keep practicing!'}`,
      type: 'quiz_completed',
    });
  },

  async notifyLearningPathGenerated(userId: string, pathTitle: string) {
    return this.create({
      userId,
      title: 'Learning Path Generated',
      message: `Your AI learning path "${pathTitle}" is ready. Start your journey!`,
      type: 'learning_path_generated',
    });
  },

  async notifyNewCoursePublished(courseTitle: string) {
    // Notify all users about a new course
    const users = await prisma.user.findMany({ select: { id: true } });
    const userIds = users.map((u) => u.id);
    return this.broadcast(
      userIds,
      'New Course Available',
      `A new course "${courseTitle}" has been published. Check it out!`,
      'course_published'
    );
  },

  async notifyReviewSubmitted(instructorId: string, courseTitle: string, rating: number) {
    return this.create({
      userId: instructorId,
      title: 'New Review',
      message: `A student left a ${rating}-star review on "${courseTitle}".`,
      type: 'review_submitted',
    });
  },
};

export default NotificationService;
