// ===================================================================
// EduBridge AI — Permission Constants & Role Mapping
// ===================================================================

export const PERMISSIONS = {
  // Course permissions
  COURSE_CREATE: 'course:create',
  COURSE_UPDATE: 'course:update',
  COURSE_DELETE: 'course:delete',
  COURSE_PUBLISH: 'course:publish',
  COURSE_VIEW_OWN: 'course:view-own',
  COURSE_VIEW_ALL: 'course:view-all',

  // Lesson permissions
  LESSON_CREATE: 'lesson:create',
  LESSON_UPDATE: 'lesson:update',
  LESSON_DELETE: 'lesson:delete',

  // User permissions
  USER_VIEW: 'user:view',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_MANAGE_ROLE: 'user:manage-role',

  // Blog permissions
  BLOG_CREATE: 'blog:create',
  BLOG_UPDATE: 'blog:update',
  BLOG_DELETE: 'blog:delete',
  BLOG_PUBLISH: 'blog:publish',

  // Review permissions
  REVIEW_CREATE: 'review:create',
  REVIEW_MODERATE: 'review:moderate',
  REVIEW_DELETE: 'review:delete',
  REVIEW_MANAGE: 'review:manage',

  // Analytics permissions
  ANALYTICS_VIEW: 'analytics:view',
  ANALYTICS_VIEW_ALL: 'analytics:view-all',

  // AI permissions
  AI_LOG_VIEW: 'ai-log:view',
  AI_TUTOR_USE: 'ai:tutor-use',
  AI_ROADMAP_USE: 'ai:roadmap-use',
  AI_QUIZ_USE: 'ai:quiz-use',

  // Category permissions
  CATEGORY_MANAGE: 'category:manage',

  // Enrollment permissions
  ENROLLMENT_CREATE: 'enrollment:create',
  ENROLLMENT_VIEW_OWN: 'enrollment:view-own',
  ENROLLMENT_VIEW_ALL: 'enrollment:view-all',
  ENROLLMENT_MANAGE: 'enrollment:manage',

  // Notification permissions
  NOTIFICATION_MANAGE: 'notification:manage',
  NOTIFICATION_ANNOUNCE: 'notification:announce',

  // Saved course permissions
  SAVED_COURSE_MANAGE: 'saved-course:manage',

  // Profile permissions
  PROFILE_MANAGE: 'profile:manage',

  // Quiz permissions
  QUIZ_CREATE: 'quiz:create',
  QUIZ_ATTEMPT: 'quiz:attempt',

  // Assignment permissions
  ASSIGNMENT_CREATE: 'assignment:create',
  ASSIGNMENT_SUBMIT: 'assignment:submit',
  ASSIGNMENT_GRADE: 'assignment:grade',

  // Live class permissions
  CLASS_MANAGE: 'class:manage',

  // Payment & Order permissions
  PAYMENT_MANAGE: 'payment:manage',
  ORDER_VIEW_OWN: 'order:view-own',
  ORDER_VIEW_ALL: 'order:view-all',

  // Message permissions
  MESSAGE_MANAGE: 'message:manage',

  // Admin & System permissions
  SYSTEM_MANAGE: 'system:manage',
  REPORT_MANAGE: 'report:manage',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * Role-to-permission mapping.
 * Each role inherits all permissions listed.
 */
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  STUDENT: [
    PERMISSIONS.PROFILE_MANAGE,
    PERMISSIONS.ENROLLMENT_CREATE,
    PERMISSIONS.ENROLLMENT_VIEW_OWN,
    PERMISSIONS.SAVED_COURSE_MANAGE,
    PERMISSIONS.REVIEW_CREATE,
    PERMISSIONS.QUIZ_ATTEMPT,
    PERMISSIONS.AI_TUTOR_USE,
    PERMISSIONS.AI_ROADMAP_USE,
    PERMISSIONS.AI_QUIZ_USE,
    PERMISSIONS.ASSIGNMENT_SUBMIT,
    PERMISSIONS.ORDER_VIEW_OWN,
    PERMISSIONS.MESSAGE_MANAGE,
  ],

  INSTRUCTOR: [
    // Inherits USER permissions
    PERMISSIONS.PROFILE_MANAGE,
    PERMISSIONS.ENROLLMENT_CREATE,
    PERMISSIONS.ENROLLMENT_VIEW_OWN,
    PERMISSIONS.SAVED_COURSE_MANAGE,
    PERMISSIONS.REVIEW_CREATE,
    PERMISSIONS.QUIZ_ATTEMPT,
    PERMISSIONS.AI_TUTOR_USE,
    PERMISSIONS.AI_ROADMAP_USE,
    PERMISSIONS.AI_QUIZ_USE,
    PERMISSIONS.ASSIGNMENT_SUBMIT,
    PERMISSIONS.ORDER_VIEW_OWN,
    PERMISSIONS.MESSAGE_MANAGE,
    // Instructor-specific
    PERMISSIONS.COURSE_CREATE,
    PERMISSIONS.COURSE_UPDATE,
    PERMISSIONS.COURSE_VIEW_OWN,
    PERMISSIONS.LESSON_CREATE,
    PERMISSIONS.LESSON_UPDATE,
    PERMISSIONS.LESSON_DELETE,
    PERMISSIONS.QUIZ_CREATE,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.ASSIGNMENT_CREATE,
    PERMISSIONS.ASSIGNMENT_GRADE,
    PERMISSIONS.CLASS_MANAGE,
  ],

  MANAGER: [
    // Inherits INSTRUCTOR permissions
    PERMISSIONS.PROFILE_MANAGE,
    PERMISSIONS.ENROLLMENT_CREATE,
    PERMISSIONS.ENROLLMENT_VIEW_OWN,
    PERMISSIONS.SAVED_COURSE_MANAGE,
    PERMISSIONS.REVIEW_CREATE,
    PERMISSIONS.QUIZ_ATTEMPT,
    PERMISSIONS.AI_TUTOR_USE,
    PERMISSIONS.AI_ROADMAP_USE,
    PERMISSIONS.AI_QUIZ_USE,
    PERMISSIONS.ASSIGNMENT_SUBMIT,
    PERMISSIONS.ORDER_VIEW_OWN,
    PERMISSIONS.MESSAGE_MANAGE,
    PERMISSIONS.COURSE_CREATE,
    PERMISSIONS.COURSE_UPDATE,
    PERMISSIONS.COURSE_VIEW_OWN,
    PERMISSIONS.LESSON_CREATE,
    PERMISSIONS.LESSON_UPDATE,
    PERMISSIONS.LESSON_DELETE,
    PERMISSIONS.QUIZ_CREATE,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.ASSIGNMENT_CREATE,
    PERMISSIONS.ASSIGNMENT_GRADE,
    PERMISSIONS.CLASS_MANAGE,
    // Manager-specific
    PERMISSIONS.COURSE_PUBLISH,
    PERMISSIONS.COURSE_DELETE,
    PERMISSIONS.COURSE_VIEW_ALL,
    PERMISSIONS.BLOG_CREATE,
    PERMISSIONS.BLOG_UPDATE,
    PERMISSIONS.BLOG_DELETE,
    PERMISSIONS.BLOG_PUBLISH,
    PERMISSIONS.REVIEW_MODERATE,
    PERMISSIONS.REVIEW_DELETE,
    PERMISSIONS.REVIEW_MANAGE,
    PERMISSIONS.CATEGORY_MANAGE,
    PERMISSIONS.ENROLLMENT_VIEW_ALL,
    PERMISSIONS.ANALYTICS_VIEW_ALL,
    PERMISSIONS.ORDER_VIEW_ALL,
    PERMISSIONS.PAYMENT_MANAGE,
  ],

  ADMIN: [
    // ADMIN has ALL permissions
    ...Object.values(PERMISSIONS),
  ],
};

/**
 * Check if a role has a specific permission.
 */
export function hasPermission(role: string, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions.includes(permission);
}

/**
 * Check if a role has ALL of the specified permissions.
 */
export function hasAllPermissions(role: string, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

/**
 * Check if a role has ANY of the specified permissions.
 */
export function hasAnyPermission(role: string, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}
