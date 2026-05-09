import { Router } from 'express';

import { AIRoutes } from '../modules/ai/ai.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { CategoryRoutes } from '../modules/category/category.route';
import { CourseRoutes } from '../modules/course/course.route';
import { DashboardRoutes } from '../modules/dashboard/dashboard.route';
import { EnrollmentRoutes } from '../modules/enrollment/enrollment.route';
import { LessonRoutes } from '../modules/lesson/lesson.route';
import { UserRoutes } from '../modules/user/user.route';
import { NotificationRoutes } from '../modules/notification/notification.route';
import { UploadRoutes } from '../modules/upload/upload.route';
import { AssignmentRoutes } from '../modules/assignment/assignment.route';
import { OrderRoutes } from '../modules/order/order.route';
import { LiveClassRoutes } from '../modules/class/class.route';
import { MessageRoutes } from '../modules/message/message.route';
import { AdminRoutes } from '../modules/admin/admin.route';
import { MentorRoutes } from '../modules/mentor/mentor.route';
import { SupportRoutes } from '../modules/support/support.route';
import { ReviewRoutes } from '../modules/review/review.route';
import { BlogRoutes } from '../modules/blog/blog.route';
import { QuizRoutes } from '../modules/quiz/quiz.route';
import { CertificateRoutes } from '../modules/certificate/certificate.route';

const router : Router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/categories',
    route: CategoryRoutes,
  },
  {
    path: '/courses',
    route: CourseRoutes,
  },
  {
    path: '/lessons',
    route: LessonRoutes,
  },
  {
    path: '/quizzes',
    route: QuizRoutes,
  },
  {
    path: '/enrollments',
    route: EnrollmentRoutes,
  },
  {
    path: '/dashboard',
    route: DashboardRoutes,
  },
  {
    path: '/ai',
    route: AIRoutes,
  },
  {
    path: '/notifications',
    route: NotificationRoutes,
  },
  {
    path: '/upload',
    route: UploadRoutes,
  },
  {
    path: '/assignments',
    route: AssignmentRoutes,
  },
  {
    path: '/orders',
    route: OrderRoutes,
  },
  {
    path: '/classes',
    route: LiveClassRoutes,
  },
  {
    path: '/messages',
    route: MessageRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/mentors',
    route: MentorRoutes,
  },
  {
    path: '/support',
    route: SupportRoutes,
  },
  {
    path: '/reviews',
    route: ReviewRoutes,
  },
  {
    path: '/blogs',
    route: BlogRoutes,
  },
  {
    path: '/certificates',
    route: CertificateRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
