import {
  notification_service_default,
  prisma
} from "./chunk-3IWMRWQB.mjs";
import {
  upload_service_default
} from "./chunk-UMC2Z43O.mjs";
import {
  config_default
} from "./chunk-Y6NVD232.mjs";

// src/app.ts
import express16 from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
    // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true
  },
  emailVerification: {
    enabled: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, token }) => {
      const EmailService = (await import("./email-EC6XRB27.mjs")).default;
      await EmailService.sendVerificationEmail(user.email, token);
    }
  },
  socialProviders: {
    google: {
      clientId: config_default.GOOGLE_CLIENT_ID,
      clientSecret: config_default.GOOGLE_CLIENT_SECRET
    }
  },
  trustedOrigins: [config_default.BETTER_AUTH_URL, config_default.CORS_ORIGIN],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "STUDENT"
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE"
      }
    }
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (user.role === "ADMIN") {
            user.role = "STUDENT";
          }
          if (user.role === "INSTRUCTOR" || user.role === "MANAGER") {
            user.status = "PENDING_APPROVAL";
          } else {
            user.status = "ACTIVE";
          }
          return { data: user };
        },
        after: async (user) => {
          const EmailService = (await import("./email-EC6XRB27.mjs")).default;
          await EmailService.sendWelcomeEmail(user.email, user.name || "Learner");
        }
      }
    }
  }
});

// src/app.ts
import { toNodeHandler } from "better-auth/node";
import { rateLimit } from "express-rate-limit";

// src/routes/index.ts
import { Router as Router19 } from "express";

// src/modules/ai/ai.route.ts
import { Router } from "express";

// src/middlewares/permission.ts
import httpStatus from "http-status";

// src/config/permissions.ts
var PERMISSIONS = {
  // Course permissions
  COURSE_CREATE: "course:create",
  COURSE_UPDATE: "course:update",
  COURSE_DELETE: "course:delete",
  COURSE_PUBLISH: "course:publish",
  COURSE_VIEW_OWN: "course:view-own",
  COURSE_VIEW_ALL: "course:view-all",
  // Lesson permissions
  LESSON_CREATE: "lesson:create",
  LESSON_UPDATE: "lesson:update",
  LESSON_DELETE: "lesson:delete",
  // User permissions
  USER_VIEW: "user:view",
  USER_UPDATE: "user:update",
  USER_DELETE: "user:delete",
  USER_MANAGE_ROLE: "user:manage-role",
  // Blog permissions
  BLOG_CREATE: "blog:create",
  BLOG_UPDATE: "blog:update",
  BLOG_DELETE: "blog:delete",
  BLOG_PUBLISH: "blog:publish",
  // Review permissions
  REVIEW_CREATE: "review:create",
  REVIEW_MODERATE: "review:moderate",
  REVIEW_DELETE: "review:delete",
  REVIEW_MANAGE: "review:manage",
  // Analytics permissions
  ANALYTICS_VIEW: "analytics:view",
  ANALYTICS_VIEW_ALL: "analytics:view-all",
  // AI permissions
  AI_LOG_VIEW: "ai-log:view",
  AI_TUTOR_USE: "ai:tutor-use",
  AI_ROADMAP_USE: "ai:roadmap-use",
  AI_QUIZ_USE: "ai:quiz-use",
  // Category permissions
  CATEGORY_MANAGE: "category:manage",
  // Enrollment permissions
  ENROLLMENT_CREATE: "enrollment:create",
  ENROLLMENT_VIEW_OWN: "enrollment:view-own",
  ENROLLMENT_VIEW_ALL: "enrollment:view-all",
  ENROLLMENT_MANAGE: "enrollment:manage",
  // Notification permissions
  NOTIFICATION_MANAGE: "notification:manage",
  NOTIFICATION_ANNOUNCE: "notification:announce",
  // Saved course permissions
  SAVED_COURSE_MANAGE: "saved-course:manage",
  // Profile permissions
  PROFILE_MANAGE: "profile:manage",
  // Quiz permissions
  QUIZ_CREATE: "quiz:create",
  QUIZ_ATTEMPT: "quiz:attempt",
  // Assignment permissions
  ASSIGNMENT_CREATE: "assignment:create",
  ASSIGNMENT_SUBMIT: "assignment:submit",
  ASSIGNMENT_GRADE: "assignment:grade",
  // Live class permissions
  CLASS_MANAGE: "class:manage",
  // Payment & Order permissions
  PAYMENT_MANAGE: "payment:manage",
  ORDER_VIEW_OWN: "order:view-own",
  ORDER_VIEW_ALL: "order:view-all",
  // Message permissions
  MESSAGE_MANAGE: "message:manage",
  // Admin & System permissions
  SYSTEM_MANAGE: "system:manage",
  REPORT_MANAGE: "report:manage"
};
var ROLE_PERMISSIONS = {
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
    PERMISSIONS.MESSAGE_MANAGE
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
    PERMISSIONS.CLASS_MANAGE
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
    PERMISSIONS.PAYMENT_MANAGE
  ],
  ADMIN: [
    // ADMIN has ALL permissions
    ...Object.values(PERMISSIONS)
  ]
};
function hasPermission(role, permission) {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions.includes(permission);
}
function hasAnyPermission(role, permissions) {
  return permissions.some((p) => hasPermission(role, p));
}

// src/utils/catchAsync.ts
var catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};
var catchAsync_default = catchAsync;

// src/middlewares/permission.ts
var requirePermission = (...requiredPermissions) => {
  return catchAsync_default(async (req, res, next) => {
    const session = await auth.api.getSession({
      headers: req.headers
    });
    if (!session) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Authentication required."
      });
    }
    const user = session.user;
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    });
    if (!dbUser) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "User not found."
      });
    }
    if (requiredPermissions.length && !hasAnyPermission(dbUser.role, requiredPermissions)) {
      return res.status(httpStatus.FORBIDDEN).json({
        success: false,
        message: "You do not have permission to perform this action."
      });
    }
    req.user = { ...user, role: dbUser.role };
    next();
  });
};
var requireAuth = catchAsync_default(async (req, res, next) => {
  const session = await auth.api.getSession({
    headers: req.headers
  });
  if (!session) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: "Authentication required."
    });
  }
  req.user = session.user;
  next();
});

// src/middlewares/validateRequest.ts
var validateRequest = (schema) => {
  return catchAsync_default(async (req, res, next) => {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
      cookies: req.cookies
    });
    next();
  });
};
var validateRequest_default = validateRequest;

// src/modules/ai/ai.controller.ts
import httpStatus2 from "http-status";

// src/utils/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    meta: data.meta,
    data: data.data
  });
};
var sendResponse_default = sendResponse;

// src/lib/ai.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
var genAI = new GoogleGenerativeAI(config_default.GEMINI_API_KEY || "");
var geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// src/modules/ai/ai.service.ts
var sanitizeInput = (str) => {
  return str.trim().slice(0, 2e3).replace(/```/g, "").replace(/\$\{/g, "").replace(/<script[^>]*>/gi, "").replace(/<\/script>/gi, "");
};
var logAIRequest = async (userId, feature, promptTokens = 0, completionTokens = 0, model = "gemini-1.5-flash") => {
  return await prisma.aIRequestLog.create({
    data: {
      userId,
      feature,
      model,
      promptTokens,
      completionTokens
    }
  });
};
var extractTokenUsage = (result) => {
  const usage = result.response.usageMetadata;
  return {
    promptTokens: usage?.promptTokenCount || 0,
    completionTokens: usage?.candidatesTokenCount || 0
  };
};
var generateLearningPath = async (userId, payload) => {
  const goal = sanitizeInput(payload.goal || "");
  const currentLevel = sanitizeInput(payload.currentLevel || "");
  const weeklyHours = Number(payload.weeklyHours) || 5;
  const learningStyle = sanitizeInput(payload.learningStyle || "");
  const prompt = `Act as an expert career coach. Create a detailed learning roadmap for:
  - Goal: "${goal}"
  - Current Level: "${currentLevel}"
  - Weekly Commitment: ${weeklyHours} hours
  - Learning Style: "${learningStyle}"
  
  Return ONLY a JSON object:
  {
    "roadmapTitle": string,
    "estimatedDuration": string,
    "phases": [{ "phase": number, "title": string, "description": string }],
    "weeklyPlan": [{ "week": number, "topics": string[], "hours": number }],
    "recommendedCourses": string[],
    "finalAdvice": string
  }`;
  const result = await geminiModel.generateContent(prompt);
  const { promptTokens, completionTokens } = extractTokenUsage(result);
  const text = result.response.text();
  const roadmapData = JSON.parse(text.replace(/```json|```/g, "").trim());
  await logAIRequest(userId, "learning-path", promptTokens, completionTokens);
  const learningPath = await prisma.learningPath.create({
    data: {
      userId,
      title: roadmapData.roadmapTitle,
      goal,
      steps: roadmapData
    }
  });
  const NotificationService = (await import("./notification.service-PEFUULUW.mjs")).default;
  NotificationService.notifyLearningPathGenerated(userId, roadmapData.roadmapTitle);
  return learningPath;
};
var getCourseRecommendations = async (userId, interests, level) => {
  const courses = await prisma.course.findMany({ where: { status: "PUBLISHED" }, select: { title: true, slug: true, level: true } });
  const courseContext = courses.map((c) => `- ${c.title} (${c.level})`).join("\n");
  const sanitizedInterests = interests.map((i) => sanitizeInput(i)).join(", ");
  const sanitizedLevel = level ? sanitizeInput(level) : "any";
  const prompt = `Based on these interests: ${sanitizedInterests} and user level: ${sanitizedLevel}.
  Available courses on platform:
  ${courseContext}

  Recommend the best courses.
  Return ONLY a JSON object:
  {
    "recommendedCourses": [{ "slug": string, "title": string, "reason": string }],
    "skillGapExplanation": string
  }`;
  const result = await geminiModel.generateContent(prompt);
  const { promptTokens, completionTokens } = extractTokenUsage(result);
  const text = result.response.text();
  const data = JSON.parse(text.replace(/```json|```/g, "").trim());
  await logAIRequest(userId, "course-recommendations", promptTokens, completionTokens);
  return data;
};
var generateQuiz = async (userId, topic, difficulty = "Medium", count = 5) => {
  const sanitizedTopic = sanitizeInput(topic);
  const sanitizedDifficulty = sanitizeInput(difficulty);
  const safeCount = Math.min(Math.max(Number(count) || 5, 1), 20);
  const prompt = `Generate a quiz about ${sanitizedTopic} with ${safeCount} questions at ${sanitizedDifficulty} difficulty.
  Return ONLY a JSON object:
  {
    "quizTitle": string,
    "questions": [
      {
        "question": string,
        "options": string[],
        "correctAnswer": string,
        "explanation": string
      }
    ]
  }`;
  const result = await geminiModel.generateContent(prompt);
  const { promptTokens, completionTokens } = extractTokenUsage(result);
  const text = result.response.text();
  const quizData = JSON.parse(text.replace(/```json|```/g, "").trim());
  await logAIRequest(userId, "quiz-generator", promptTokens, completionTokens);
  return quizData;
};
var chatWithAI = async (userId, payload) => {
  const message = sanitizeInput(payload.message || "");
  const courseContext = payload.courseContext ? sanitizeInput(payload.courseContext) : "";
  const conversationId = payload.conversationId;
  let conversation;
  if (conversationId) {
    conversation = await prisma.aIConversation.findUnique({ where: { id: conversationId } });
  }
  if (!conversation) {
    conversation = await prisma.aIConversation.create({
      data: { userId, title: message.substring(0, 30) }
    });
  }
  await prisma.aIMessage.create({
    data: { conversationId: conversation.id, role: "user", content: message }
  });
  const previousMessages = await prisma.aIMessage.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: "desc" },
    take: 5
  });
  const history = previousMessages.reverse().map((m) => `${m.role}: ${m.content}`).join("\n");
  const prompt = `You are a helpful AI Tutor on EduBridge AI.
  ${courseContext ? `Current Course Context: ${courseContext}` : ""}
  Chat History:
  ${history}
  
  User message: "${message}"
  
  Return ONLY a JSON object:
  {
    "answer": string,
    "suggestedNextQuestions": string[],
    "relatedTopics": string[]
  }`;
  const result = await geminiModel.generateContent(prompt);
  const { promptTokens, completionTokens } = extractTokenUsage(result);
  const text = result.response.text();
  const data = JSON.parse(text.replace(/```json|```/g, "").trim());
  await prisma.aIMessage.create({
    data: { conversationId: conversation.id, role: "assistant", content: data.answer }
  });
  await logAIRequest(userId, "chat", promptTokens, completionTokens);
  return {
    conversationId: conversation.id,
    ...data
  };
};
var analyzeProgress = async (userId) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: { select: { title: true } },
      lessonProgress: {
        where: { isCompleted: true },
        include: { lesson: { select: { title: true } } }
      }
    }
  });
  const quizAttempts = await prisma.quizAttempt.findMany({
    where: { userId },
    include: {
      quiz: { select: { title: true } }
    }
  });
  const prompt = `Analyze this student's data for personal career coaching:
  - Enrollments: ${JSON.stringify(enrollments.map((e) => ({
    course: e.course.title,
    progress: e.progress,
    status: e.status,
    completedLessons: e.lessonProgress.map((lp) => lp.lesson.title)
  })))}
  - Quiz Attempts: ${JSON.stringify(quizAttempts.map((q) => ({ topic: q.quiz?.title || "General", score: q.score, total: q.totalQuestions })))}
  
  Based on this real progress data, provide:
  1. A meaningful progress summary.
  2. Specific strengths and areas for improvement.
  3. Actionable next steps (mentioning specific lessons or courses).
  4. Predicted skill level.

  Return ONLY a JSON object:
  {
    "progressSummary": string,
    "strengths": string[],
    "weaknesses": string[],
    "recommendedActions": string[],
    "recommendedCourses": string[]
  }`;
  const result = await geminiModel.generateContent(prompt);
  const { promptTokens, completionTokens } = extractTokenUsage(result);
  const text = result.response.text();
  const analysis = JSON.parse(text.replace(/```json|```/g, "").trim());
  await logAIRequest(userId, "progress-analyzer", promptTokens, completionTokens);
  return analysis;
};
var getConversations = async (userId) => {
  const conversations = await prisma.aIConversation.findMany({
    where: { userId },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1
      }
    },
    orderBy: { updatedAt: "desc" }
  });
  return conversations;
};
var getConversationById = async (userId, conversationId) => {
  const conversation = await prisma.aIConversation.findUnique({
    where: { id: conversationId, userId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" }
      }
    }
  });
  return conversation;
};
var getUserLearningPaths = async (userId) => {
  const result = await prisma.learningPath.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
  return result;
};
var AIService = {
  generateLearningPath,
  getCourseRecommendations,
  generateQuiz,
  chatWithAI,
  analyzeProgress,
  getConversations,
  getConversationById,
  getUserLearningPaths
};

// src/modules/ai/ai.controller.ts
var generateLearningPath2 = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  const result = await AIService.generateLearningPath(userId, req.body);
  sendResponse_default(res, {
    statusCode: httpStatus2.OK,
    success: true,
    message: "Learning roadmap generated successfully",
    data: result
  });
});
var getCourseRecommendations2 = catchAsync_default(async (req, res) => {
  const { interests, level } = req.body;
  const userId = req.user.id;
  const result = await AIService.getCourseRecommendations(userId, interests, level);
  sendResponse_default(res, {
    statusCode: httpStatus2.OK,
    success: true,
    message: "Course recommendations generated successfully",
    data: result
  });
});
var generateQuiz2 = catchAsync_default(async (req, res) => {
  const { topic, difficulty, count } = req.body;
  const userId = req.user.id;
  const result = await AIService.generateQuiz(userId, topic, difficulty, count);
  sendResponse_default(res, {
    statusCode: httpStatus2.OK,
    success: true,
    message: "Quiz generated successfully",
    data: result
  });
});
var chatWithAI2 = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  const result = await AIService.chatWithAI(userId, req.body);
  sendResponse_default(res, {
    statusCode: httpStatus2.OK,
    success: true,
    message: "AI response received",
    data: result
  });
});
var analyzeProgress2 = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  const result = await AIService.analyzeProgress(userId);
  sendResponse_default(res, {
    statusCode: httpStatus2.OK,
    success: true,
    message: "Progress analysis completed",
    data: result
  });
});
var getConversations2 = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  const result = await AIService.getConversations(userId);
  sendResponse_default(res, {
    statusCode: httpStatus2.OK,
    success: true,
    message: "AI conversations retrieved successfully",
    data: result
  });
});
var getConversationById2 = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const result = await AIService.getConversationById(userId, id);
  sendResponse_default(res, {
    statusCode: httpStatus2.OK,
    success: true,
    message: "AI conversation retrieved successfully",
    data: result
  });
});
var getUserLearningPaths2 = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  const result = await AIService.getUserLearningPaths(userId);
  sendResponse_default(res, {
    statusCode: httpStatus2.OK,
    success: true,
    message: "User learning paths retrieved successfully",
    data: result
  });
});
var AIController = {
  generateLearningPath: generateLearningPath2,
  getCourseRecommendations: getCourseRecommendations2,
  generateQuiz: generateQuiz2,
  chatWithAI: chatWithAI2,
  analyzeProgress: analyzeProgress2,
  getConversations: getConversations2,
  getConversationById: getConversationById2,
  getUserLearningPaths: getUserLearningPaths2
};

// src/modules/ai/ai.validation.ts
import { z } from "zod";
var learningPathSchema = z.object({
  body: z.object({
    goal: z.string("Goal is required").min(5).max(500),
    currentLevel: z.string("Current skill level is required"),
    weeklyHours: z.number().min(1).max(168),
    learningStyle: z.string("Preferred learning style is required")
  })
});
var courseRecommendationsSchema = z.object({
  body: z.object({
    interests: z.array(z.string()).min(1),
    level: z.enum(["Beginner", "Intermediate", "Advanced"]).optional()
  })
});
var quizGeneratorSchema = z.object({
  body: z.object({
    topic: z.string("Topic is required"),
    difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(),
    count: z.number().min(1).max(20).optional()
  })
});
var aiChatSchema = z.object({
  body: z.object({
    message: z.string("Message is required").min(1).max(2e3),
    conversationId: z.string().optional(),
    courseContext: z.string().optional()
  })
});
var progressAnalyzerSchema = z.object({
  body: z.object({}).optional()
});
var AIValidations = {
  learningPathSchema,
  courseRecommendationsSchema,
  quizGeneratorSchema,
  aiChatSchema,
  progressAnalyzerSchema
};

// src/modules/ai/ai.route.ts
var router = Router();
router.post(
  "/learning-path",
  requirePermission(PERMISSIONS.AI_ROADMAP_USE),
  validateRequest_default(AIValidations.learningPathSchema),
  AIController.generateLearningPath
);
router.get(
  "/learning-path/my",
  requirePermission(PERMISSIONS.AI_ROADMAP_USE),
  AIController.getUserLearningPaths
);
router.post(
  "/course-recommendations",
  requirePermission(PERMISSIONS.AI_ROADMAP_USE),
  validateRequest_default(AIValidations.courseRecommendationsSchema),
  AIController.getCourseRecommendations
);
router.post(
  "/quiz-generator",
  requirePermission(PERMISSIONS.AI_QUIZ_USE),
  validateRequest_default(AIValidations.quizGeneratorSchema),
  AIController.generateQuiz
);
router.post(
  "/chat",
  requirePermission(PERMISSIONS.AI_TUTOR_USE),
  validateRequest_default(AIValidations.aiChatSchema),
  AIController.chatWithAI
);
router.get(
  "/conversations",
  requirePermission(PERMISSIONS.AI_TUTOR_USE),
  AIController.getConversations
);
router.get(
  "/conversations/:id",
  requirePermission(PERMISSIONS.AI_TUTOR_USE),
  AIController.getConversationById
);
router.post(
  "/progress-analyzer",
  requirePermission(PERMISSIONS.AI_TUTOR_USE),
  validateRequest_default(AIValidations.progressAnalyzerSchema),
  AIController.analyzeProgress
);
var AIRoutes = router;

// src/modules/auth/auth.route.ts
import { Router as Router2 } from "express";
var router2 = Router2();
var AuthRoutes = router2;

// src/modules/category/category.route.ts
import { Router as Router3 } from "express";

// src/modules/category/category.controller.ts
import httpStatus3 from "http-status";

// src/modules/category/category.service.ts
var createCategoryInDB = async (payload) => {
  const result = await prisma.courseCategory.create({
    data: payload
  });
  return result;
};
var getAllCategoriesFromDB = async () => {
  const result = await prisma.courseCategory.findMany({
    include: {
      _count: {
        select: { courses: true }
      }
    }
  });
  return result;
};
var CategoryService = {
  createCategoryInDB,
  getAllCategoriesFromDB
};

// src/modules/category/category.controller.ts
var createCategory = catchAsync_default(async (req, res) => {
  const result = await CategoryService.createCategoryInDB(req.body);
  sendResponse_default(res, {
    statusCode: httpStatus3.CREATED,
    success: true,
    message: "Category created successfully",
    data: result
  });
});
var getAllCategories = catchAsync_default(async (req, res) => {
  const result = await CategoryService.getAllCategoriesFromDB();
  sendResponse_default(res, {
    statusCode: httpStatus3.OK,
    success: true,
    message: "Categories retrieved successfully",
    data: result
  });
});
var CategoryController = {
  createCategory,
  getAllCategories
};

// src/modules/category/category.route.ts
var router3 = Router3();
router3.get("/", CategoryController.getAllCategories);
router3.post(
  "/",
  requirePermission(PERMISSIONS.CATEGORY_MANAGE),
  CategoryController.createCategory
);
var CategoryRoutes = router3;

// src/modules/course/course.route.ts
import { Router as Router4 } from "express";

// src/modules/course/course.controller.ts
import httpStatus4 from "http-status";

// src/modules/course/course.service.ts
var createCourseIntoDB = async (payload) => {
  const { lessons, ...courseData } = payload;
  const result = await prisma.course.create({
    data: {
      ...courseData,
      lessons: {
        create: lessons?.map((lesson, index) => ({
          ...lesson,
          slug: lesson.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
          order: index + 1
        }))
      }
    },
    include: {
      lessons: true,
      category: true
    }
  });
  return result;
};
var getAllCoursesFromDB = async (query) => {
  const {
    searchTerm,
    category,
    level,
    minPrice,
    maxPrice,
    sortBy = "createdAt",
    sortOrder = "desc",
    page = 1,
    limit = 10
  } = query;
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);
  const filter = {
    status: "PUBLISHED"
  };
  if (searchTerm) {
    filter.OR = [
      { title: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } }
    ];
  }
  if (category) {
    filter.category = { slug: category };
  }
  if (level) {
    filter.level = level;
  }
  if (minPrice || maxPrice) {
    filter.price = {
      ...minPrice ? { gte: Number(minPrice) } : {},
      ...maxPrice ? { lte: Number(maxPrice) } : {}
    };
  }
  const result = await prisma.course.findMany({
    where: filter,
    include: {
      instructor: {
        select: { name: true, email: true }
      },
      category: true,
      _count: {
        select: { reviews: true }
      }
    },
    orderBy: {
      [sortBy]: sortOrder
    },
    skip,
    take
  });
  const total = await prisma.course.count({ where: filter });
  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPage: Math.ceil(total / Number(limit))
    },
    data: result
  };
};
var getCourseBySlugFromDB = async (slug) => {
  const result = await prisma.course.findUnique({
    where: { slug },
    include: {
      instructor: true,
      category: true,
      lessons: {
        orderBy: { order: "asc" }
      },
      reviews: {
        include: { user: true }
      },
      _count: {
        select: { enrollments: true }
      }
    }
  });
  return result;
};
var updateCourseInDB = async (id, payload) => {
  const result = await prisma.course.update({
    where: { id },
    data: payload
  });
  if (payload.status === "PUBLISHED") {
    const NotificationService = (await import("./notification.service-PEFUULUW.mjs")).default;
    NotificationService.notifyNewCoursePublished(result.title);
  }
  return result;
};
var deleteCourseFromDB = async (id) => {
  const result = await prisma.course.update({
    where: { id },
    data: { status: "ARCHIVED" }
  });
  return result;
};
var getMyCoursesFromDB = async (instructorId) => {
  const result = await prisma.course.findMany({
    where: { instructorId },
    include: {
      category: true,
      _count: {
        select: { enrollments: true, reviews: true, lessons: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
  return result;
};
var getCourseByIdFromDB = async (id) => {
  const result = await prisma.course.findUnique({
    where: { id },
    include: {
      category: true,
      lessons: {
        orderBy: { order: "asc" }
      },
      assignments: true,
      quizzes: true
    }
  });
  return result;
};
var getRelatedCoursesFromDB = async (courseId) => {
  const currentCourse = await prisma.course.findUnique({
    where: { id: courseId },
    select: { categoryId: true, level: true }
  });
  if (!currentCourse) throw new Error("Course not found");
  const result = await prisma.course.findMany({
    where: {
      categoryId: currentCourse.categoryId,
      id: { not: courseId },
      status: "PUBLISHED"
    },
    include: {
      instructor: { select: { name: true } },
      category: true,
      _count: { select: { reviews: true } }
    },
    take: 4,
    orderBy: { createdAt: "desc" }
  });
  return result;
};
var CourseService = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getCourseBySlugFromDB,
  getMyCoursesFromDB,
  getCourseByIdFromDB,
  getRelatedCoursesFromDB,
  updateCourseInDB,
  deleteCourseFromDB
};

// src/modules/course/course.controller.ts
var createCourse = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  const result = await CourseService.createCourseIntoDB({
    ...req.body,
    instructorId: userId
  });
  sendResponse_default(res, {
    statusCode: httpStatus4.CREATED,
    success: true,
    message: "Course created successfully",
    data: result
  });
});
var getMyCourses = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  const result = await CourseService.getMyCoursesFromDB(userId);
  sendResponse_default(res, {
    statusCode: httpStatus4.OK,
    success: true,
    message: "Instructor courses retrieved successfully",
    data: result
  });
});
var getCourseById = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const result = await CourseService.getCourseByIdFromDB(id);
  sendResponse_default(res, {
    statusCode: httpStatus4.OK,
    success: true,
    message: "Course retrieved successfully",
    data: result
  });
});
var getAllCourses = catchAsync_default(async (req, res) => {
  const result = await CourseService.getAllCoursesFromDB(req.query);
  sendResponse_default(res, {
    statusCode: httpStatus4.OK,
    success: true,
    message: "Courses retrieved successfully",
    meta: result.meta,
    data: result.data
  });
});
var getCourseBySlug = catchAsync_default(async (req, res) => {
  const { slug } = req.params;
  const result = await CourseService.getCourseBySlugFromDB(slug);
  sendResponse_default(res, {
    statusCode: httpStatus4.OK,
    success: true,
    message: "Course retrieved successfully",
    data: result
  });
});
var updateCourse = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const role = req.user.role;
  const course = await CourseService.getCourseByIdFromDB(id);
  if (!course) {
    return sendResponse_default(res, {
      statusCode: httpStatus4.NOT_FOUND,
      success: false,
      message: "Course not found",
      data: null
    });
  }
  if (course.instructorId !== userId && role !== "ADMIN") {
    return sendResponse_default(res, {
      statusCode: httpStatus4.FORBIDDEN,
      success: false,
      message: "You do not have permission to update this course",
      data: null
    });
  }
  const result = await CourseService.updateCourseInDB(id, req.body);
  sendResponse_default(res, {
    statusCode: httpStatus4.OK,
    success: true,
    message: "Course updated successfully",
    data: result
  });
});
var deleteCourse = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const role = req.user.role;
  const course = await CourseService.getCourseByIdFromDB(id);
  if (!course) {
    return sendResponse_default(res, {
      statusCode: httpStatus4.NOT_FOUND,
      success: false,
      message: "Course not found",
      data: null
    });
  }
  if (course.instructorId !== userId && role !== "ADMIN") {
    return sendResponse_default(res, {
      statusCode: httpStatus4.FORBIDDEN,
      success: false,
      message: "You do not have permission to delete this course",
      data: null
    });
  }
  const result = await CourseService.deleteCourseFromDB(id);
  sendResponse_default(res, {
    statusCode: httpStatus4.OK,
    success: true,
    message: "Course archived successfully",
    data: result
  });
});
var getRelatedCourses = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const result = await CourseService.getRelatedCoursesFromDB(id);
  sendResponse_default(res, {
    statusCode: httpStatus4.OK,
    success: true,
    message: "Related courses retrieved successfully",
    data: result
  });
});
var CourseController = {
  createCourse,
  getMyCourses,
  getCourseById,
  getAllCourses,
  getCourseBySlug,
  getRelatedCourses,
  updateCourse,
  deleteCourse
};

// src/modules/course/course.validation.ts
import { z as z2 } from "zod";
var createCourseZodSchema = z2.object({
  body: z2.object({
    title: z2.string("Title is required"),
    slug: z2.string("Slug is required"),
    description: z2.string("Description is required"),
    price: z2.number().min(0).default(0),
    level: z2.string().default("Beginner"),
    categoryId: z2.string("Category ID is required"),
    instructorId: z2.string().optional(),
    thumbnailUrl: z2.string().optional(),
    duration: z2.string().optional(),
    lessons: z2.array(z2.object({
      title: z2.string(),
      duration: z2.string().optional()
    })).optional()
  })
});
var updateCourseZodSchema = z2.object({
  body: z2.object({
    title: z2.string().optional(),
    description: z2.string().optional(),
    price: z2.number().min(0).optional(),
    level: z2.string().optional(),
    categoryId: z2.string().optional(),
    instructorId: z2.string().optional(),
    thumbnailUrl: z2.string().optional(),
    duration: z2.string().optional(),
    status: z2.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional()
  })
});
var CourseValidations = {
  createCourseZodSchema,
  updateCourseZodSchema
};

// src/modules/course/course.route.ts
var router4 = Router4();
router4.get("/", CourseController.getAllCourses);
router4.get("/my-courses", requirePermission(PERMISSIONS.COURSE_VIEW_OWN), CourseController.getMyCourses);
router4.get("/details/:id", requirePermission(PERMISSIONS.COURSE_VIEW_OWN), CourseController.getCourseById);
router4.get("/related/:id", CourseController.getRelatedCourses);
router4.get("/:slug", CourseController.getCourseBySlug);
router4.post(
  "/",
  requirePermission(PERMISSIONS.COURSE_CREATE),
  validateRequest_default(CourseValidations.createCourseZodSchema),
  CourseController.createCourse
);
router4.patch(
  "/:id",
  requirePermission(PERMISSIONS.COURSE_UPDATE),
  validateRequest_default(CourseValidations.updateCourseZodSchema),
  CourseController.updateCourse
);
router4.delete("/:id", requirePermission(PERMISSIONS.COURSE_DELETE), CourseController.deleteCourse);
var CourseRoutes = router4;

// src/modules/dashboard/dashboard.route.ts
import { Router as Router5 } from "express";

// src/modules/dashboard/dashboard.controller.ts
import httpStatus5 from "http-status";

// src/modules/dashboard/dashboard.service.ts
var getUserDashboardData = async (userId) => {
  const [enrolledCourses, savedCourses, quizAttempts, notifications, recentActivity] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            instructor: { select: { name: true } },
            category: { select: { name: true } }
          }
        }
      },
      take: 7,
      orderBy: { updatedAt: "desc" }
    }),
    prisma.savedCourse.findMany({
      where: { userId },
      include: { course: true },
      take: 5
    }),
    prisma.quizAttempt.findMany({
      where: { userId },
      include: {
        quiz: {
          select: {
            title: true,
            course: { select: { title: true } }
          }
        }
      },
      take: 5,
      orderBy: { createdAt: "desc" }
    }),
    prisma.notification.findMany({
      where: { userId, isRead: false },
      take: 5,
      orderBy: { createdAt: "desc" }
    }),
    prisma.auditLog.findMany({
      where: { actorId: userId },
      take: 10,
      orderBy: { createdAt: "desc" }
    })
  ]);
  const progressStats = await prisma.enrollment.aggregate({
    where: { userId },
    _avg: { progress: true },
    _count: { id: true }
  });
  const quizTrend = quizAttempts.map((qa) => ({
    date: qa.createdAt.toISOString().split("T")[0],
    score: qa.score
  })).reverse();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0];
  }).reverse();
  const weeklyActivity = last7Days.map((date) => {
    const count = recentActivity.filter((a) => a.createdAt.toISOString().split("T")[0] === date).length;
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
      totalEnrolled: progressStats._count.id
    },
    charts: {
      weeklyActivity,
      quizTrend,
      courseProgress: enrolledCourses.map((e) => ({ name: e.course.title.substring(0, 15) + "...", progress: e.progress }))
    }
  };
};
var getInstructorDashboardData = async (userId) => {
  const [myCourses, recentReviews, totalEnrollments, recentEnrollments, revenueData] = await Promise.all([
    prisma.course.findMany({
      where: { instructorId: userId },
      include: {
        _count: { select: { enrollments: true, reviews: true } },
        reviews: { select: { rating: true } }
      }
    }),
    prisma.review.findMany({
      where: { course: { instructorId: userId } },
      include: {
        user: { select: { name: true, image: true } },
        course: { select: { title: true } }
      },
      take: 5,
      orderBy: { createdAt: "desc" }
    }),
    prisma.enrollment.count({
      where: { course: { instructorId: userId } }
    }),
    prisma.enrollment.findMany({
      where: { course: { instructorId: userId } },
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } }
      },
      take: 5,
      orderBy: { createdAt: "desc" }
    }),
    prisma.order.aggregate({
      where: {
        course: { instructorId: userId },
        status: "SUCCESS"
      },
      _sum: { amount: true }
    })
  ]);
  let totalRating = 0;
  let totalReviewCount = 0;
  myCourses.forEach((course) => {
    const courseRatingSum = course.reviews.reduce((sum, r) => sum + r.rating, 0);
    totalRating += courseRatingSum;
    totalReviewCount += course.reviews.length;
  });
  const avgRating = totalReviewCount > 0 ? totalRating / totalReviewCount : 0;
  const sixMonthsAgo = /* @__PURE__ */ new Date();
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
  const ratingDist = [1, 2, 3, 4, 5].map((star) => {
    let count = 0;
    myCourses.forEach((c) => {
      count += c.reviews.filter((r) => Math.round(r.rating) === star).length;
    });
    return { name: `${star} Star`, count };
  });
  const completionData = await Promise.all(myCourses.map(async (c) => {
    const stats = await prisma.enrollment.aggregate({
      where: { courseId: c.id },
      _avg: { progress: true }
    });
    return {
      name: c.title.substring(0, 10) + "...",
      rate: Math.round(stats._avg.progress || 0)
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
      totalRevenue: revenueData._sum.amount || 0
    },
    coursePerformance: myCourses.map((c) => {
      const rating = c.reviews.length > 0 ? c.reviews.reduce((sum, r) => sum + r.rating, 0) / c.reviews.length : 0;
      return {
        id: c.id,
        title: c.title,
        enrollments: c._count.enrollments,
        rating: Number(rating.toFixed(1))
      };
    }),
    charts: {
      monthlyEnrollments,
      ratingDistribution: ratingDist,
      completionRates: completionData
    }
  };
};
var getAdminDashboardData = async () => {
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
      include: { _count: { select: { courses: true } } }
    }),
    prisma.user.groupBy({
      by: ["role"],
      _count: { id: true }
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    }),
    prisma.enrollment.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } }, course: { select: { title: true } } }
    }),
    prisma.aIRequestLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } }
    }),
    prisma.course.findMany({
      take: 5,
      orderBy: { enrollments: { _count: "desc" } },
      include: { _count: { select: { enrollments: true } } }
    }),
    prisma.user.count({
      where: { role: "INSTRUCTOR", status: "PENDING_APPROVAL" }
    }),
    prisma.aIRequestLog.count()
  ]);
  const sixMonthsAgo = /* @__PURE__ */ new Date();
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
  const monthlyRevenue = await prisma.$queryRaw`
    SELECT 
      TO_CHAR("createdAt", 'Mon YYYY') as month,
      SUM(amount)::int as revenue
    FROM "Order"
    WHERE "createdAt" >= ${sixMonthsAgo} AND status = 'SUCCESS'
    GROUP BY month
    ORDER BY MIN("createdAt")
  `;
  const aiUsageRaw = await prisma.aIRequestLog.groupBy({
    by: ["feature"],
    _count: { id: true }
  });
  const aiUsage = aiUsageRaw.map((item) => ({
    feature: item.feature,
    count: item._count.id
  }));
  return {
    stats: {
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalReviews,
      avgRating: avgRating._avg.rating ? Number(avgRating._avg.rating.toFixed(1)) : 0,
      pendingInstructors: pendingInstructorsCount,
      totalAIRequests: totalAIRequestsCount
    },
    charts: {
      categoryDistribution: categoryDistribution.map((c) => ({ name: c.name, count: c._count.courses })),
      roleDistribution: roleDistribution.map((r) => ({ role: r.role, count: r._count.id })),
      monthlyEnrollments,
      monthlyRevenue,
      aiUsage
    },
    recentUsers,
    recentEnrollments,
    aiLogs,
    topCourses: topCourses.map((c) => ({
      ...c,
      enrolledCount: c._count.enrollments
    }))
  };
};
var DashboardService = {
  getUserDashboardData,
  getInstructorDashboardData,
  getAdminDashboardData
};

// src/modules/dashboard/dashboard.controller.ts
var getUserDashboard = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  const result = await DashboardService.getUserDashboardData(userId);
  sendResponse_default(res, {
    statusCode: httpStatus5.OK,
    success: true,
    message: "User dashboard data retrieved successfully",
    data: result
  });
});
var getInstructorDashboard = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  const result = await DashboardService.getInstructorDashboardData(userId);
  sendResponse_default(res, {
    statusCode: httpStatus5.OK,
    success: true,
    message: "Instructor dashboard data retrieved successfully",
    data: result
  });
});
var getAdminDashboard = catchAsync_default(async (req, res) => {
  const result = await DashboardService.getAdminDashboardData();
  sendResponse_default(res, {
    statusCode: httpStatus5.OK,
    success: true,
    message: "Admin dashboard data retrieved successfully",
    data: result
  });
});
var DashboardController = {
  getUserDashboard,
  getInstructorDashboard,
  getAdminDashboard
};

// src/modules/dashboard/dashboard.route.ts
var router5 = Router5();
router5.get(
  "/user",
  requirePermission(PERMISSIONS.ENROLLMENT_VIEW_OWN),
  DashboardController.getUserDashboard
);
router5.get(
  "/instructor",
  requirePermission(PERMISSIONS.ANALYTICS_VIEW),
  DashboardController.getInstructorDashboard
);
router5.get(
  "/admin",
  requirePermission(PERMISSIONS.ANALYTICS_VIEW_ALL),
  DashboardController.getAdminDashboard
);
var DashboardRoutes = router5;

// src/modules/enrollment/enrollment.route.ts
import { Router as Router6 } from "express";

// src/modules/enrollment/enrollment.controller.ts
import httpStatus6 from "http-status";

// src/modules/enrollment/enrollment.service.ts
var enrollInCourseInDB = async (userId, courseId) => {
  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } }
  });
  if (existing) throw new Error("You are already enrolled in this course.");
  const result = await prisma.enrollment.create({
    data: {
      userId,
      courseId,
      status: "ACTIVE"
    },
    include: {
      course: true,
      user: true
    }
  });
  const NotificationService = (await import("./notification.service-PEFUULUW.mjs")).default;
  const EmailService = (await import("./email-EC6XRB27.mjs")).default;
  NotificationService.notifyEnrollmentSuccess(userId, result.course.title);
  EmailService.sendEnrollmentConfirmation(result.user.email, result.user.name || "Learner", result.course.title);
  return result;
};
var getMyEnrollmentsFromDB = async (userId) => {
  const result = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          instructor: { select: { name: true } },
          category: true
        }
      }
    }
  });
  return result;
};
var updateProgressInDB = async (enrollmentId, lessonId, isCompleted) => {
  await prisma.lessonProgress.upsert({
    where: {
      enrollmentId_lessonId: {
        enrollmentId,
        lessonId
      }
    },
    update: {
      isCompleted,
      completedAt: isCompleted ? /* @__PURE__ */ new Date() : null
    },
    create: {
      enrollmentId,
      lessonId,
      isCompleted,
      completedAt: isCompleted ? /* @__PURE__ */ new Date() : null
    }
  });
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      course: {
        include: { lessons: true }
      },
      lessonProgress: {
        where: { isCompleted: true }
      }
    }
  });
  if (!enrollment) throw new Error("Enrollment not found");
  const totalLessons = enrollment.course.lessons.length;
  const completedLessons = enrollment.lessonProgress.length;
  const progress = totalLessons > 0 ? completedLessons / totalLessons * 100 : 0;
  const result = await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: {
      progress,
      lastAccessedLessonId: lessonId,
      status: progress === 100 ? "COMPLETED" : "ACTIVE"
    }
  });
  return result;
};
var getCourseProgressFromDB = async (userId, courseIdentifier) => {
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
        courseId: course.id
      }
    },
    include: {
      lessonProgress: true,
      course: {
        include: {
          lessons: {
            orderBy: { order: "asc" },
            include: { resources: true }
          }
        }
      }
    }
  });
  return result;
};
var getLearningSummaryFromDB = async (userId) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        select: { title: true, thumbnailUrl: true }
      }
    }
  });
  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter((e) => e.progress === 100).length;
  const averageProgress = totalCourses > 0 ? enrollments.reduce((acc, curr) => acc + curr.progress, 0) / totalCourses : 0;
  return {
    totalCourses,
    completedCourses,
    averageProgress,
    recentEnrollments: enrollments.slice(0, 5)
  };
};
var getUserQuizzesFromDB = async (userId) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    select: { courseId: true }
  });
  const courseIds = enrollments.map((e) => e.courseId);
  const quizzes = await prisma.quiz.findMany({
    where: { courseId: { in: courseIds } },
    include: {
      course: { select: { title: true } },
      _count: { select: { questions: true, attempts: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  return quizzes;
};
var getUserQuizAttemptsFromDB = async (userId) => {
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId },
    include: {
      quiz: {
        select: {
          title: true,
          course: { select: { title: true } }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
  return attempts;
};
var getQuizDetailsFromDB = async (userId, quizId) => {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      course: true,
      questions: true
    }
  });
  if (!quiz) {
    throw new Error("Quiz not found");
  }
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: quiz.courseId
      }
    }
  });
  if (!enrollment) {
    throw new Error("You are not enrolled in the course associated with this quiz");
  }
  return quiz;
};
var submitQuizAttemptInDB = async (userId, quizId, userAnswers) => {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { questions: true }
  });
  if (!quiz) {
    throw new Error("Quiz not found");
  }
  let correctCount = 0;
  const totalQuestions = quiz.questions.length;
  quiz.questions.forEach((q) => {
    if (userAnswers[q.id] === q.correctAnswer) {
      correctCount++;
    }
  });
  const score = correctCount / totalQuestions * 100;
  const result = await prisma.quizAttempt.create({
    data: {
      userId,
      quizId,
      score,
      totalQuestions,
      answers: userAnswers,
      status: score >= 70 ? "COMPLETED" : "FAILED"
      // Example threshold
    },
    include: {
      quiz: {
        select: {
          title: true,
          course: { select: { title: true } }
        }
      }
    }
  });
  return result;
};
var getInstructorStudentsFromDB = async (instructorId) => {
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
      createdAt: "desc"
    }
  });
  return result;
};
var EnrollmentService = {
  enrollInCourseInDB,
  getMyEnrollmentsFromDB,
  getInstructorStudentsFromDB,
  updateProgressInDB,
  getCourseProgressFromDB,
  getLearningSummaryFromDB,
  getUserQuizzesFromDB,
  getUserQuizAttemptsFromDB,
  getQuizDetailsFromDB,
  submitQuizAttemptInDB
};

// src/modules/enrollment/enrollment.controller.ts
var enrollInCourse = catchAsync_default(async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user.id;
  const result = await EnrollmentService.enrollInCourseInDB(userId, courseId);
  sendResponse_default(res, {
    statusCode: httpStatus6.CREATED,
    success: true,
    message: "Enrolled in course successfully",
    data: result
  });
});
var getMyEnrollments = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  const result = await EnrollmentService.getMyEnrollmentsFromDB(userId);
  sendResponse_default(res, {
    statusCode: httpStatus6.OK,
    success: true,
    message: "Enrollments retrieved successfully",
    data: result
  });
});
var updateProgress = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const { lessonId, isCompleted } = req.body;
  const result = await EnrollmentService.updateProgressInDB(id, lessonId, isCompleted);
  sendResponse_default(res, {
    statusCode: httpStatus6.OK,
    success: true,
    message: "Progress updated successfully",
    data: result
  });
});
var getCourseProgress = catchAsync_default(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;
  const result = await EnrollmentService.getCourseProgressFromDB(userId, courseId);
  sendResponse_default(res, {
    statusCode: httpStatus6.OK,
    success: true,
    message: "Course progress retrieved successfully",
    data: result
  });
});
var getLearningSummary = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  const result = await EnrollmentService.getLearningSummaryFromDB(userId);
  sendResponse_default(res, {
    statusCode: httpStatus6.OK,
    success: true,
    message: "Learning summary retrieved successfully",
    data: result
  });
});
var getUserQuizzes = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  const result = await EnrollmentService.getUserQuizzesFromDB(userId);
  sendResponse_default(res, {
    statusCode: httpStatus6.OK,
    success: true,
    message: "Quizzes retrieved successfully",
    data: result
  });
});
var getUserQuizAttempts = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  const result = await EnrollmentService.getUserQuizAttemptsFromDB(userId);
  sendResponse_default(res, {
    statusCode: httpStatus6.OK,
    success: true,
    message: "Quiz attempts retrieved successfully",
    data: result
  });
});
var getQuizDetails = catchAsync_default(async (req, res) => {
  const { quizId } = req.params;
  const userId = req.user.id;
  const result = await EnrollmentService.getQuizDetailsFromDB(userId, quizId);
  sendResponse_default(res, {
    statusCode: httpStatus6.OK,
    success: true,
    message: "Quiz details retrieved successfully",
    data: result
  });
});
var submitQuizAttempt = catchAsync_default(async (req, res) => {
  const { quizId } = req.params;
  const { answers } = req.body;
  const userId = req.user.id;
  const result = await EnrollmentService.submitQuizAttemptInDB(userId, quizId, answers);
  sendResponse_default(res, {
    statusCode: httpStatus6.OK,
    success: true,
    message: "Quiz submitted successfully",
    data: result
  });
});
var getInstructorStudents = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  const result = await EnrollmentService.getInstructorStudentsFromDB(userId);
  sendResponse_default(res, {
    statusCode: httpStatus6.OK,
    success: true,
    message: "Instructor students retrieved successfully",
    data: result
  });
});
var EnrollmentController = {
  enrollInCourse,
  getMyEnrollments,
  getInstructorStudents,
  updateProgress,
  getCourseProgress,
  getLearningSummary,
  getUserQuizzes,
  getUserQuizAttempts,
  getQuizDetails,
  submitQuizAttempt
};

// src/modules/enrollment/enrollment.route.ts
var router6 = Router6();
router6.get("/my-enrollments", requirePermission(PERMISSIONS.ENROLLMENT_VIEW_OWN), EnrollmentController.getMyEnrollments);
router6.get("/instructor", requirePermission(PERMISSIONS.ENROLLMENT_VIEW_ALL), EnrollmentController.getInstructorStudents);
router6.post(
  "/enroll",
  requirePermission(PERMISSIONS.ENROLLMENT_CREATE),
  EnrollmentController.enrollInCourse
);
router6.get("/summary", requirePermission(PERMISSIONS.ENROLLMENT_VIEW_OWN), EnrollmentController.getLearningSummary);
router6.get("/course/:courseId", requirePermission(PERMISSIONS.ENROLLMENT_VIEW_OWN), EnrollmentController.getCourseProgress);
router6.patch(
  "/:id/progress",
  requirePermission(PERMISSIONS.ENROLLMENT_VIEW_OWN),
  EnrollmentController.updateProgress
);
router6.get("/quizzes", requirePermission(PERMISSIONS.ENROLLMENT_VIEW_OWN), EnrollmentController.getUserQuizzes);
router6.get("/quizzes/:quizId", requirePermission(PERMISSIONS.ENROLLMENT_VIEW_OWN), EnrollmentController.getQuizDetails);
router6.post("/quizzes/:quizId/submit", requirePermission(PERMISSIONS.ENROLLMENT_VIEW_OWN), EnrollmentController.submitQuizAttempt);
router6.get("/quiz-attempts", requirePermission(PERMISSIONS.ENROLLMENT_VIEW_OWN), EnrollmentController.getUserQuizAttempts);
var EnrollmentRoutes = router6;

// src/modules/lesson/lesson.route.ts
import { Router as Router7 } from "express";

// src/modules/lesson/lesson.controller.ts
import httpStatus7 from "http-status";

// src/modules/lesson/lesson.service.ts
var createLessonIntoDB = async (payload) => {
  const lessonData = {
    ...payload,
    slug: payload.slug || payload.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "")
  };
  const result = await prisma.lesson.create({
    data: lessonData
  });
  return result;
};
var updateLessonInDB = async (id, payload) => {
  const result = await prisma.lesson.update({
    where: { id },
    data: payload
  });
  return result;
};
var deleteLessonFromDB = async (id) => {
  const result = await prisma.lesson.delete({
    where: { id }
  });
  return result;
};
var getLessonsByCourseIdFromDB = async (courseId) => {
  const result = await prisma.lesson.findMany({
    where: { courseId },
    orderBy: { order: "asc" }
  });
  return result;
};
var LessonService = {
  createLessonIntoDB,
  updateLessonInDB,
  deleteLessonFromDB,
  getLessonsByCourseIdFromDB
};

// src/modules/lesson/lesson.controller.ts
var createLesson = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;
  const { courseId } = req.body;
  const course = await CourseService.getCourseByIdFromDB(courseId);
  if (!course) {
    return sendResponse_default(res, {
      statusCode: httpStatus7.NOT_FOUND,
      success: false,
      message: "Course not found",
      data: null
    });
  }
  if (course.instructorId !== userId && role !== "ADMIN") {
    return sendResponse_default(res, {
      statusCode: httpStatus7.FORBIDDEN,
      success: false,
      message: "You do not have permission to add lessons to this course",
      data: null
    });
  }
  const result = await LessonService.createLessonIntoDB(req.body);
  sendResponse_default(res, {
    statusCode: httpStatus7.CREATED,
    success: true,
    message: "Lesson created successfully",
    data: result
  });
});
var updateLesson = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const role = req.user.role;
  const lesson = await prisma?.lesson.findUnique({ where: { id }, include: { course: true } });
  if (!lesson) {
    return sendResponse_default(res, {
      statusCode: httpStatus7.NOT_FOUND,
      success: false,
      message: "Lesson not found",
      data: null
    });
  }
  if (lesson.course.instructorId !== userId && role !== "ADMIN") {
    return sendResponse_default(res, {
      statusCode: httpStatus7.FORBIDDEN,
      success: false,
      message: "You do not have permission to update this lesson",
      data: null
    });
  }
  const result = await LessonService.updateLessonInDB(id, req.body);
  sendResponse_default(res, {
    statusCode: httpStatus7.OK,
    success: true,
    message: "Lesson updated successfully",
    data: result
  });
});
var deleteLesson = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const role = req.user.role;
  const lesson = await prisma?.lesson.findUnique({ where: { id }, include: { course: true } });
  if (!lesson) {
    return sendResponse_default(res, {
      statusCode: httpStatus7.NOT_FOUND,
      success: false,
      message: "Lesson not found",
      data: null
    });
  }
  if (lesson.course.instructorId !== userId && role !== "ADMIN") {
    return sendResponse_default(res, {
      statusCode: httpStatus7.FORBIDDEN,
      success: false,
      message: "You do not have permission to delete this lesson",
      data: null
    });
  }
  const result = await LessonService.deleteLessonFromDB(id);
  sendResponse_default(res, {
    statusCode: httpStatus7.OK,
    success: true,
    message: "Lesson deleted successfully",
    data: result
  });
});
var LessonController = {
  createLesson,
  updateLesson,
  deleteLesson
};

// src/modules/lesson/lesson.route.ts
import { z as z3 } from "zod";
var router7 = Router7();
var lessonSchema = z3.object({
  body: z3.object({
    title: z3.string("Title is required"),
    slug: z3.string("Slug is required"),
    content: z3.string().optional(),
    videoUrl: z3.string().optional(),
    duration: z3.string().optional(),
    order: z3.number("Order is required"),
    courseId: z3.string("Course ID is required")
  })
});
router7.post(
  "/",
  requirePermission(PERMISSIONS.LESSON_CREATE),
  validateRequest_default(lessonSchema),
  LessonController.createLesson
);
router7.patch(
  "/:id",
  requirePermission(PERMISSIONS.LESSON_UPDATE),
  LessonController.updateLesson
);
router7.delete(
  "/:id",
  requirePermission(PERMISSIONS.LESSON_DELETE),
  LessonController.deleteLesson
);
var LessonRoutes = router7;

// src/modules/user/user.route.ts
import { Router as Router8 } from "express";

// src/modules/user/user.controller.ts
import httpStatus8 from "http-status";

// src/modules/user/user.service.ts
var getAllUsersFromDB = async () => {
  const result = await prisma.user.findMany();
  return result;
};
var getSingleUserFromDB = async (id) => {
  const result = await prisma.user.findUnique({
    where: { id },
    include: { profile: true }
  });
  return result;
};
var getMyProfileFromDB = async (userId) => {
  const result = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      profile: true
    }
  });
  return result;
};
var updateMyProfileInDB = async (userId, payload) => {
  if (payload.name) {
    await prisma.user.update({
      where: { id: userId },
      data: { name: payload.name }
    });
  }
  const profileData = {};
  if (payload.bio !== void 0) profileData.bio = payload.bio;
  if (payload.headline !== void 0) profileData.headline = payload.headline;
  if (Object.keys(profileData).length > 0) {
    await prisma.profile.upsert({
      where: { userId },
      update: profileData,
      create: { userId, ...profileData }
    });
  }
  return getMyProfileFromDB(userId);
};
var UserService = {
  getAllUsersFromDB,
  getSingleUserFromDB,
  getMyProfileFromDB,
  updateMyProfileInDB
};

// src/modules/user/user.controller.ts
var getAllUsers = catchAsync_default(async (req, res) => {
  const result = await UserService.getAllUsersFromDB();
  sendResponse_default(res, {
    statusCode: httpStatus8.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result
  });
});
var getSingleUser = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.getSingleUserFromDB(id);
  sendResponse_default(res, {
    statusCode: httpStatus8.OK,
    success: true,
    message: "User retrieved successfully",
    data: result
  });
});
var getMyProfile = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  const result = await UserService.getMyProfileFromDB(userId);
  sendResponse_default(res, {
    statusCode: httpStatus8.OK,
    success: true,
    message: "Profile retrieved successfully",
    data: result
  });
});
var updateMyProfile = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  const result = await UserService.updateMyProfileInDB(userId, req.body);
  sendResponse_default(res, {
    statusCode: httpStatus8.OK,
    success: true,
    message: "Profile updated successfully",
    data: result
  });
});
var UserController = {
  getAllUsers,
  getSingleUser,
  getMyProfile,
  updateMyProfile
};

// src/modules/user/user.route.ts
var router8 = Router8();
router8.get("/me", requireAuth, UserController.getMyProfile);
router8.patch("/me", requirePermission(PERMISSIONS.PROFILE_MANAGE), UserController.updateMyProfile);
router8.get("/", requirePermission(PERMISSIONS.USER_VIEW), UserController.getAllUsers);
router8.get("/:id", requirePermission(PERMISSIONS.USER_VIEW), UserController.getSingleUser);
var UserRoutes = router8;

// src/modules/notification/notification.route.ts
import { Router as Router9 } from "express";

// src/modules/notification/notification.controller.ts
import httpStatus9 from "http-status";
var getMyNotifications = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const result = await notification_service_default.getMyNotifications(userId, page, limit);
  sendResponse_default(res, {
    statusCode: httpStatus9.OK,
    success: true,
    message: "Notifications fetched successfully",
    data: result
  });
});
var markRead = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  await notification_service_default.markAsRead(id, userId);
  sendResponse_default(res, {
    statusCode: httpStatus9.OK,
    success: true,
    message: "Notification marked as read",
    data: null
  });
});
var markAllRead = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  await notification_service_default.markAllAsRead(userId);
  sendResponse_default(res, {
    statusCode: httpStatus9.OK,
    success: true,
    message: "All notifications marked as read",
    data: null
  });
});
var deleteNotification = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  await notification_service_default.delete(id, userId);
  sendResponse_default(res, {
    statusCode: httpStatus9.OK,
    success: true,
    message: "Notification deleted successfully",
    data: null
  });
});
var createAnnouncement = catchAsync_default(async (req, res) => {
  const { title, message } = req.body;
  const result = await notification_service_default.createAnnouncement(title, message);
  sendResponse_default(res, {
    statusCode: httpStatus9.CREATED,
    success: true,
    message: "Announcement created successfully",
    data: result
  });
});
var NotificationController = {
  getMyNotifications,
  markRead,
  markAllRead,
  deleteNotification,
  createAnnouncement
};

// src/modules/notification/notification.route.ts
var router9 = Router9();
router9.get(
  "/",
  requireAuth,
  NotificationController.getMyNotifications
);
router9.patch(
  "/mark-all-read",
  requireAuth,
  NotificationController.markAllRead
);
router9.patch(
  "/:id/read",
  requireAuth,
  NotificationController.markRead
);
router9.delete(
  "/:id",
  requireAuth,
  NotificationController.deleteNotification
);
router9.post(
  "/announce",
  requirePermission(PERMISSIONS.NOTIFICATION_ANNOUNCE),
  NotificationController.createAnnouncement
);
var NotificationRoutes = router9;

// src/modules/upload/upload.route.ts
import { Router as Router10 } from "express";

// src/modules/upload/upload.controller.ts
import httpStatus10 from "http-status";
var uploadImage = catchAsync_default(async (req, res) => {
  const file = req.file;
  if (!file) {
    return sendResponse_default(res, {
      statusCode: httpStatus10.BAD_REQUEST,
      success: false,
      message: "No file uploaded",
      data: null
    });
  }
  sendResponse_default(res, {
    statusCode: httpStatus10.OK,
    success: true,
    message: "Image uploaded successfully",
    data: {
      url: file.cloudinaryUrl,
      publicId: file.cloudinaryPublicId
    }
  });
});
var deleteImage = catchAsync_default(async (req, res) => {
  const { publicId } = req.params;
  const uploadService = (await import("./upload.service-NN5BW2H2.mjs")).default;
  const result = await uploadService.deleteImage(publicId);
  if (!result) {
    return sendResponse_default(res, {
      statusCode: httpStatus10.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Failed to delete image from storage",
      data: null
    });
  }
  sendResponse_default(res, {
    statusCode: httpStatus10.OK,
    success: true,
    message: "Image deleted successfully",
    data: result
  });
});
var UploadController = {
  uploadImage,
  deleteImage
};

// src/modules/upload/upload.route.ts
var router10 = Router10();
router10.post(
  "/image",
  requireAuth,
  ...upload_service_default.single("image"),
  UploadController.uploadImage
);
router10.delete(
  "/image/:publicId",
  requireAuth,
  UploadController.deleteImage
);
var UploadRoutes = router10;

// src/modules/assignment/assignment.route.ts
import { Router as Router11 } from "express";

// src/modules/assignment/assignment.controller.ts
import httpStatus11 from "http-status";

// src/modules/assignment/assignment.service.ts
var createAssignmentInDB = async (payload) => {
  const result = await prisma.assignment.create({
    data: payload
  });
  return result;
};
var getCourseAssignmentsFromDB = async (courseId) => {
  const result = await prisma.assignment.findMany({
    where: { courseId },
    include: {
      _count: {
        select: { submissions: true }
      }
    }
  });
  return result;
};
var getUserAssignmentsFromDB = async (userId) => {
  const result = await prisma.assignment.findMany({
    where: {
      course: {
        enrollments: {
          some: {
            userId
          }
        }
      }
    },
    include: {
      course: {
        select: {
          title: true
        }
      },
      submissions: {
        where: {
          studentId: userId
        }
      }
    },
    orderBy: {
      dueDate: "asc"
    }
  });
  return result;
};
var submitAssignmentToDB = async (payload) => {
  const result = await prisma.assignmentSubmission.create({
    data: payload
  });
  return result;
};
var getSubmissionsFromDB = async (assignmentId) => {
  const result = await prisma.assignmentSubmission.findMany({
    where: { assignmentId },
    include: {
      student: {
        select: { id: true, name: true, email: true }
      }
    }
  });
  return result;
};
var gradeSubmissionInDB = async (id, payload) => {
  const data = {
    grade: payload.grade,
    status: "GRADED"
  };
  if (payload.feedback !== void 0) {
    data.feedback = payload.feedback;
  }
  const result = await prisma.assignmentSubmission.update({
    where: { id },
    data
  });
  return result;
};
var getInstructorAssignmentsFromDB = async (instructorId) => {
  const result = await prisma.assignment.findMany({
    where: {
      course: {
        instructorId
      }
    },
    include: {
      course: {
        select: {
          title: true
        }
      },
      _count: {
        select: { submissions: true }
      },
      submissions: {
        where: {
          status: "PENDING"
        },
        select: {
          id: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return result.map((assignment) => ({
    ...assignment,
    pendingCount: assignment.submissions.length,
    submissions: void 0
    // Hide the list of IDs
  }));
};
var AssignmentService = {
  createAssignmentInDB,
  getCourseAssignmentsFromDB,
  getUserAssignmentsFromDB,
  getInstructorAssignmentsFromDB,
  submitAssignmentToDB,
  getSubmissionsFromDB,
  gradeSubmissionInDB
};

// src/modules/assignment/assignment.controller.ts
var createAssignment = catchAsync_default(async (req, res) => {
  const result = await AssignmentService.createAssignmentInDB(req.body);
  sendResponse_default(res, {
    statusCode: httpStatus11.CREATED,
    success: true,
    message: "Assignment created successfully",
    data: result
  });
});
var getCourseAssignments = catchAsync_default(async (req, res) => {
  const { courseId } = req.params;
  const result = await AssignmentService.getCourseAssignmentsFromDB(courseId);
  sendResponse_default(res, {
    statusCode: httpStatus11.OK,
    success: true,
    message: "Assignments retrieved successfully",
    data: result
  });
});
var getUserAssignments = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  const result = await AssignmentService.getUserAssignmentsFromDB(userId);
  sendResponse_default(res, {
    statusCode: httpStatus11.OK,
    success: true,
    message: "User assignments retrieved successfully",
    data: result
  });
});
var submitAssignment = catchAsync_default(async (req, res) => {
  const studentId = req.user.id;
  const result = await AssignmentService.submitAssignmentToDB({
    ...req.body,
    studentId
  });
  sendResponse_default(res, {
    statusCode: httpStatus11.CREATED,
    success: true,
    message: "Assignment submitted successfully",
    data: result
  });
});
var getSubmissions = catchAsync_default(async (req, res) => {
  const { assignmentId } = req.params;
  const result = await AssignmentService.getSubmissionsFromDB(assignmentId);
  sendResponse_default(res, {
    statusCode: httpStatus11.OK,
    success: true,
    message: "Submissions retrieved successfully",
    data: result
  });
});
var gradeSubmission = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const result = await AssignmentService.gradeSubmissionInDB(id, req.body);
  sendResponse_default(res, {
    statusCode: httpStatus11.OK,
    success: true,
    message: "Submission graded successfully",
    data: result
  });
});
var getInstructorAssignments = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  const result = await AssignmentService.getInstructorAssignmentsFromDB(userId);
  sendResponse_default(res, {
    statusCode: httpStatus11.OK,
    success: true,
    message: "Instructor assignments retrieved successfully",
    data: result
  });
});
var AssignmentController = {
  createAssignment,
  getCourseAssignments,
  getUserAssignments,
  getInstructorAssignments,
  submitAssignment,
  getSubmissions,
  gradeSubmission
};

// src/modules/assignment/assignment.route.ts
var router11 = Router11();
router11.post(
  "/",
  requirePermission(PERMISSIONS.ASSIGNMENT_CREATE),
  AssignmentController.createAssignment
);
router11.get(
  "/user",
  requirePermission(PERMISSIONS.ENROLLMENT_VIEW_OWN),
  AssignmentController.getUserAssignments
);
router11.get(
  "/instructor",
  requirePermission(PERMISSIONS.ASSIGNMENT_GRADE),
  AssignmentController.getInstructorAssignments
);
router11.get(
  "/course/:courseId",
  requirePermission(PERMISSIONS.ENROLLMENT_VIEW_OWN),
  // Students in course can view assignments
  AssignmentController.getCourseAssignments
);
router11.post(
  "/submit",
  requirePermission(PERMISSIONS.ASSIGNMENT_SUBMIT),
  AssignmentController.submitAssignment
);
router11.get(
  "/submissions/:assignmentId",
  requirePermission(PERMISSIONS.ASSIGNMENT_GRADE),
  AssignmentController.getSubmissions
);
router11.patch(
  "/grade/:id",
  requirePermission(PERMISSIONS.ASSIGNMENT_GRADE),
  AssignmentController.gradeSubmission
);
var AssignmentRoutes = router11;

// src/modules/order/order.route.ts
import { Router as Router12 } from "express";

// src/modules/order/order.controller.ts
import httpStatus12 from "http-status";

// src/modules/order/order.service.ts
var createOrderInDB = async (userId, courseId) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new Error("Course not found");
  const result = await prisma.order.create({
    data: {
      userId,
      courseId,
      amount: course.price,
      currency: "USD",
      status: "PENDING"
    }
  });
  return result;
};
var capturePaymentInDB = async (orderId, transactionId, method) => {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.update({
      where: { id: orderId },
      data: {
        status: "SUCCESS",
        transactionId,
        paymentMethod: method
      }
    });
    await tx.payment.create({
      data: {
        orderId,
        amount: order.amount,
        status: "COMPLETED",
        transactionId,
        method
      }
    });
    const existingEnrollment = await tx.enrollment.findUnique({
      where: { userId_courseId: { userId: order.userId, courseId: order.courseId } }
    });
    if (!existingEnrollment) {
      await tx.enrollment.create({
        data: {
          userId: order.userId,
          courseId: order.courseId,
          status: "ACTIVE"
        }
      });
    }
    return order;
  });
};
var getMyOrdersFromDB = async (userId) => {
  const result = await prisma.order.findMany({
    where: { userId },
    include: { course: { select: { title: true, thumbnailUrl: true } } },
    orderBy: { createdAt: "desc" }
  });
  return result;
};
var getAllOrdersFromDB = async () => {
  const result = await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  return result.map((order) => ({
    ...order,
    user: {
      ...order.user,
      email: order.user?.email ? `${order.user.email.substring(0, 2)}***@${order.user.email.split("@")[1]}` : "Unknown"
    }
  }));
};
var OrderService = {
  createOrderInDB,
  capturePaymentInDB,
  getMyOrdersFromDB,
  getAllOrdersFromDB
};

// src/modules/order/order.controller.ts
var createOrder = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  const { courseId } = req.body;
  const result = await OrderService.createOrderInDB(userId, courseId);
  sendResponse_default(res, {
    statusCode: httpStatus12.CREATED,
    success: true,
    message: "Order created successfully",
    data: result
  });
});
var checkout = catchAsync_default(async (req, res) => {
  const { orderId, transactionId, method } = req.body;
  const result = await OrderService.capturePaymentInDB(orderId, transactionId, method);
  sendResponse_default(res, {
    statusCode: httpStatus12.OK,
    success: true,
    message: "Payment captured and enrollment successful",
    data: result
  });
});
var getMyOrders = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  const result = await OrderService.getMyOrdersFromDB(userId);
  sendResponse_default(res, {
    statusCode: httpStatus12.OK,
    success: true,
    message: "Orders retrieved successfully",
    data: result
  });
});
var getAllOrders = catchAsync_default(async (req, res) => {
  const result = await OrderService.getAllOrdersFromDB();
  sendResponse_default(res, {
    statusCode: httpStatus12.OK,
    success: true,
    message: "All orders retrieved successfully",
    data: result
  });
});
var OrderController = {
  createOrder,
  checkout,
  getMyOrders,
  getAllOrders
};

// src/modules/order/order.route.ts
var router12 = Router12();
router12.post(
  "/create",
  requirePermission(PERMISSIONS.ENROLLMENT_CREATE),
  OrderController.createOrder
);
router12.post(
  "/checkout",
  requirePermission(PERMISSIONS.ENROLLMENT_CREATE),
  OrderController.checkout
);
router12.get(
  "/my-orders",
  requirePermission(PERMISSIONS.ORDER_VIEW_OWN),
  OrderController.getMyOrders
);
router12.get(
  "/all",
  requirePermission(PERMISSIONS.ORDER_VIEW_ALL),
  OrderController.getAllOrders
);
var OrderRoutes = router12;

// src/modules/class/class.route.ts
import { Router as Router13 } from "express";

// src/modules/class/class.controller.ts
import httpStatus13 from "http-status";

// src/modules/class/class.service.ts
var createLiveClassInDB = async (payload) => {
  const result = await prisma.liveClass.create({
    data: payload
  });
  return result;
};
var getCourseLiveClassesFromDB = async (courseId) => {
  const result = await prisma.liveClass.findMany({
    where: { courseId },
    orderBy: { startTime: "asc" }
  });
  return result;
};
var updateLiveClassInDB = async (id, payload) => {
  const result = await prisma.liveClass.update({
    where: { id },
    data: payload
  });
  return result;
};
var deleteLiveClassFromDB = async (id) => {
  const result = await prisma.liveClass.delete({
    where: { id }
  });
  return result;
};
var getUserLiveClassesFromDB = async (userId) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId, status: "ACTIVE" },
    select: { courseId: true }
  });
  const courseIds = enrollments.map((e) => e.courseId);
  const result = await prisma.liveClass.findMany({
    where: { courseId: { in: courseIds } },
    include: {
      course: {
        select: {
          title: true,
          instructor: { select: { name: true } }
        }
      }
    },
    orderBy: { startTime: "asc" }
  });
  return result;
};
var LiveClassService = {
  createLiveClassInDB,
  getCourseLiveClassesFromDB,
  getUserLiveClassesFromDB,
  updateLiveClassInDB,
  deleteLiveClassFromDB
};

// src/modules/class/class.controller.ts
var createLiveClass = catchAsync_default(async (req, res) => {
  const result = await LiveClassService.createLiveClassInDB(req.body);
  sendResponse_default(res, {
    statusCode: httpStatus13.CREATED,
    success: true,
    message: "Live class scheduled successfully",
    data: result
  });
});
var getCourseLiveClasses = catchAsync_default(async (req, res) => {
  const { courseId } = req.params;
  const result = await LiveClassService.getCourseLiveClassesFromDB(courseId);
  sendResponse_default(res, {
    statusCode: httpStatus13.OK,
    success: true,
    message: "Live classes retrieved successfully",
    data: result
  });
});
var updateLiveClass = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const result = await LiveClassService.updateLiveClassInDB(id, req.body);
  sendResponse_default(res, {
    statusCode: httpStatus13.OK,
    success: true,
    message: "Live class updated successfully",
    data: result
  });
});
var deleteLiveClass = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  await LiveClassService.deleteLiveClassFromDB(id);
  sendResponse_default(res, {
    statusCode: httpStatus13.OK,
    success: true,
    message: "Live class deleted successfully",
    data: null
  });
});
var getUserLiveClasses = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  const result = await LiveClassService.getUserLiveClassesFromDB(userId);
  sendResponse_default(res, {
    statusCode: httpStatus13.OK,
    success: true,
    message: "User live classes retrieved successfully",
    data: result
  });
});
var LiveClassController = {
  createLiveClass,
  getCourseLiveClasses,
  getUserLiveClasses,
  updateLiveClass,
  deleteLiveClass
};

// src/modules/class/class.route.ts
var router13 = Router13();
router13.get(
  "/user",
  requirePermission(PERMISSIONS.ENROLLMENT_VIEW_OWN),
  LiveClassController.getUserLiveClasses
);
router13.post(
  "/",
  requirePermission(PERMISSIONS.CLASS_MANAGE),
  LiveClassController.createLiveClass
);
router13.get(
  "/course/:courseId",
  requirePermission(PERMISSIONS.ENROLLMENT_VIEW_OWN),
  // Students in course can view classes
  LiveClassController.getCourseLiveClasses
);
router13.patch(
  "/:id",
  requirePermission(PERMISSIONS.CLASS_MANAGE),
  LiveClassController.updateLiveClass
);
router13.delete(
  "/:id",
  requirePermission(PERMISSIONS.CLASS_MANAGE),
  LiveClassController.deleteLiveClass
);
var LiveClassRoutes = router13;

// src/modules/message/message.route.ts
import { Router as Router14 } from "express";

// src/modules/message/message.controller.ts
import httpStatus14 from "http-status";

// src/modules/message/message.service.ts
var sendMessageInDB = async (payload) => {
  const result = await prisma.message.create({
    data: payload
  });
  return result;
};
var getMyConversationsFromDB = async (userId) => {
  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }]
    },
    orderBy: { createdAt: "desc" },
    include: {
      sender: { select: { id: true, name: true, image: true } },
      receiver: { select: { id: true, name: true, image: true } }
    }
  });
  const conversations = /* @__PURE__ */ new Map();
  messages.forEach((msg) => {
    const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
    if (!conversations.has(otherUser.id)) {
      conversations.set(otherUser.id, {
        user: otherUser,
        lastMessage: msg.content,
        createdAt: msg.createdAt
      });
    }
  });
  return Array.from(conversations.values());
};
var getChatWithUserFromDB = async (userId, otherUserId) => {
  const result = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId }
      ]
    },
    orderBy: { createdAt: "asc" }
  });
  await prisma.message.updateMany({
    where: { senderId: otherUserId, receiverId: userId, isRead: false },
    data: { isRead: true }
  });
  return result;
};
var MessageService = {
  sendMessageInDB,
  getMyConversationsFromDB,
  getChatWithUserFromDB
};

// src/modules/message/message.controller.ts
var sendMessage = catchAsync_default(async (req, res) => {
  const senderId = req.user.id;
  const result = await MessageService.sendMessageInDB({
    ...req.body,
    senderId
  });
  sendResponse_default(res, {
    statusCode: httpStatus14.CREATED,
    success: true,
    message: "Message sent successfully",
    data: result
  });
});
var getConversations3 = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  const result = await MessageService.getMyConversationsFromDB(userId);
  sendResponse_default(res, {
    statusCode: httpStatus14.OK,
    success: true,
    message: "Conversations retrieved successfully",
    data: result
  });
});
var getChat = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  const { otherUserId } = req.params;
  const result = await MessageService.getChatWithUserFromDB(userId, otherUserId);
  sendResponse_default(res, {
    statusCode: httpStatus14.OK,
    success: true,
    message: "Chat retrieved successfully",
    data: result
  });
});
var MessageController = {
  sendMessage,
  getConversations: getConversations3,
  getChat
};

// src/modules/message/message.route.ts
var router14 = Router14();
router14.post(
  "/",
  requirePermission(PERMISSIONS.MESSAGE_MANAGE),
  MessageController.sendMessage
);
router14.get(
  "/conversations",
  requirePermission(PERMISSIONS.MESSAGE_MANAGE),
  MessageController.getConversations
);
router14.get(
  "/chat/:otherUserId",
  requirePermission(PERMISSIONS.MESSAGE_MANAGE),
  MessageController.getChat
);
var MessageRoutes = router14;

// src/modules/admin/admin.route.ts
import { Router as Router15 } from "express";

// src/modules/admin/admin.controller.ts
import httpStatus15 from "http-status";

// src/modules/admin/admin.service.ts
var maskEmail = (email) => {
  if (!email) return "";
  const [local, domain] = email.split("@");
  if (!domain || !local) return email;
  if (local.length <= 2) return `*@${domain}`;
  return `${local.substring(0, 2)}***@${domain}`;
};
var maskPhone = (phone) => {
  if (!phone) return null;
  if (phone.length <= 7) return "***";
  return `${phone.substring(0, 4)}******${phone.substring(phone.length - 3)}`;
};
var logAdminAction = async (adminId, action, entityType, entityId, metadata, req) => {
  await prisma.auditLog.create({
    data: {
      actorId: adminId,
      action,
      entityType,
      entityId,
      metadata: metadata ?? null,
      ipAddress: req?.ip ?? null,
      userAgent: req?.headers ? req.headers["user-agent"] : null
    }
  });
};
var safeUserSelect = {
  id: true,
  name: true,
  email: true,
  // Will be masked after retrieval
  role: true,
  status: true,
  image: true,
  createdAt: true,
  emailVerified: true,
  profile: {
    select: {
      phone: true,
      // Will be masked
      bio: true
      // Exclude precise address
    }
  }
};
var getSafeStudentsFromDB = async () => {
  const users = await prisma.user.findMany({
    where: { role: "STUDENT" },
    select: {
      ...safeUserSelect,
      _count: { select: { enrollments: true, quizAttempts: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  return users.map((user) => ({
    ...user,
    email: maskEmail(user.email),
    profile: user.profile ? {
      ...user.profile,
      phone: maskPhone(user.profile.phone)
    } : null
  }));
};
var getSafeInstructorsFromDB = async () => {
  const users = await prisma.user.findMany({
    where: { role: { in: ["INSTRUCTOR", "MANAGER"] } },
    select: {
      ...safeUserSelect,
      _count: { select: { enrollments: true } },
      mentorProfile: { select: { expertise: true, experience: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  return users.map((user) => ({
    ...user,
    email: maskEmail(user.email),
    profile: user.profile ? {
      ...user.profile,
      phone: maskPhone(user.profile.phone)
    } : null
  }));
};
var updateUserRoleInDB = async (adminId, id, role, req) => {
  const result = await prisma.user.update({
    where: { id },
    data: { role },
    select: safeUserSelect
  });
  await logAdminAction(adminId, "UPDATE_ROLE", "User", id, `Changed role to ${role}`, req);
  return { ...result, email: maskEmail(result.email) };
};
var updateUserStatusInDB = async (adminId, id, status, req) => {
  const result = await prisma.user.update({
    where: { id },
    data: { status },
    select: safeUserSelect
  });
  await logAdminAction(adminId, "UPDATE_STATUS", "User", id, `Changed status to ${status}`, req);
  return { ...result, email: maskEmail(result.email) };
};
var getPendingInstructorsFromDB = async () => {
  const result = await prisma.user.findMany({
    where: {
      role: "INSTRUCTOR",
      status: "PENDING_APPROVAL"
    },
    select: safeUserSelect,
    orderBy: { createdAt: "desc" }
  });
  return result.map((user) => ({
    ...user,
    email: maskEmail(user.email)
  }));
};
var getSystemSettingsFromDB = async () => {
  return await prisma.systemSetting.findMany();
};
var updateSystemSettingInDB = async (adminId, key, value, req) => {
  const result = await prisma.systemSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value }
  });
  await logAdminAction(adminId, "UPDATE_SETTING", "SystemSetting", key, `Updated setting ${key}`, req);
  return result;
};
var getPlatformReportsFromDB = async () => {
  const result = await prisma.report.findMany({
    include: {
      reporter: { select: { id: true, name: true, email: true, image: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  return result.map((report) => ({
    ...report,
    reporter: {
      ...report.reporter,
      email: maskEmail(report.reporter.email)
    }
  }));
};
var updateReportStatusInDB = async (adminId, id, status, req) => {
  const result = await prisma.report.update({
    where: { id },
    data: { status }
  });
  await logAdminAction(adminId, "UPDATE_REPORT_STATUS", "Report", id, `Updated report status to ${status}`, req);
  return result;
};
var getAuditLogsFromDB = async () => {
  return await prisma.auditLog.findMany({
    include: {
      actor: { select: { id: true, name: true, role: true, email: true } }
    },
    orderBy: { createdAt: "desc" }
  });
};
var getPendingCoursesFromDB = async () => {
  const result = await prisma.course.findMany({
    where: { status: "IN_REVIEW" },
    include: {
      instructor: { select: { id: true, name: true, email: true, image: true } },
      category: true
    },
    orderBy: { updatedAt: "asc" }
  });
  return result.map((course) => ({
    ...course,
    instructor: {
      ...course.instructor,
      email: maskEmail(course.instructor.email)
    }
  }));
};
var getAllCoursesFromDB2 = async () => {
  const result = await prisma.course.findMany({
    include: {
      instructor: { select: { id: true, name: true, email: true, image: true } },
      category: true,
      _count: { select: { enrollments: true, lessons: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  return result.map((course) => ({
    ...course,
    instructor: {
      ...course.instructor,
      email: maskEmail(course.instructor.email)
    }
  }));
};
var updateCourseStatusInDB = async (adminId, id, status, req) => {
  const result = await prisma.course.update({
    where: { id },
    data: { status }
  });
  await logAdminAction(adminId, "UPDATE_COURSE_STATUS", "Course", id, `Changed course status to ${status}`, req);
  return result;
};
var AdminService = {
  getSafeStudentsFromDB,
  getSafeInstructorsFromDB,
  updateUserRoleInDB,
  updateUserStatusInDB,
  getPendingInstructorsFromDB,
  getSystemSettingsFromDB,
  updateSystemSettingInDB,
  getPlatformReportsFromDB,
  updateReportStatusInDB,
  getAuditLogsFromDB,
  getPendingCoursesFromDB,
  getAllCoursesFromDB: getAllCoursesFromDB2,
  updateCourseStatusInDB
};

// src/modules/admin/admin.controller.ts
var getStudents = catchAsync_default(async (req, res) => {
  const result = await AdminService.getSafeStudentsFromDB();
  sendResponse_default(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "Students retrieved successfully (Privacy Masked)",
    data: result
  });
});
var getInstructors = catchAsync_default(async (req, res) => {
  const result = await AdminService.getSafeInstructorsFromDB();
  sendResponse_default(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "Instructors retrieved successfully (Privacy Masked)",
    data: result
  });
});
var updateUserRole = catchAsync_default(async (req, res) => {
  const adminId = req.user.id;
  const { id } = req.params;
  const { role } = req.body;
  const result = await AdminService.updateUserRoleInDB(adminId, id, role, req);
  sendResponse_default(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "User role updated successfully",
    data: result
  });
});
var updateUserStatus = catchAsync_default(async (req, res) => {
  const adminId = req.user.id;
  const { id } = req.params;
  const { status } = req.body;
  const result = await AdminService.updateUserStatusInDB(adminId, id, status, req);
  sendResponse_default(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "User status updated successfully",
    data: result
  });
});
var getPendingInstructors = catchAsync_default(async (req, res) => {
  const result = await AdminService.getPendingInstructorsFromDB();
  sendResponse_default(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "Pending instructors retrieved successfully",
    data: result
  });
});
var getSettings = catchAsync_default(async (req, res) => {
  const result = await AdminService.getSystemSettingsFromDB();
  sendResponse_default(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "System settings retrieved successfully",
    data: result
  });
});
var updateSetting = catchAsync_default(async (req, res) => {
  const adminId = req.user.id;
  const { key, value } = req.body;
  const result = await AdminService.updateSystemSettingInDB(adminId, key, value, req);
  sendResponse_default(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "System setting updated successfully",
    data: result
  });
});
var getReports = catchAsync_default(async (req, res) => {
  const result = await AdminService.getPlatformReportsFromDB();
  sendResponse_default(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "Platform reports retrieved successfully",
    data: result
  });
});
var updateReportStatus = catchAsync_default(async (req, res) => {
  const adminId = req.user.id;
  const { id } = req.params;
  const { status } = req.body;
  const result = await AdminService.updateReportStatusInDB(adminId, id, status, req);
  sendResponse_default(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "Report status updated successfully",
    data: result
  });
});
var getAuditLogs = catchAsync_default(async (req, res) => {
  const result = await AdminService.getAuditLogsFromDB();
  sendResponse_default(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "Audit logs retrieved successfully",
    data: result
  });
});
var getPendingCourses = catchAsync_default(async (req, res) => {
  const result = await AdminService.getPendingCoursesFromDB();
  sendResponse_default(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "Pending courses retrieved successfully",
    data: result
  });
});
var getAllCourses2 = catchAsync_default(async (req, res) => {
  const result = await AdminService.getAllCoursesFromDB();
  sendResponse_default(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "All courses retrieved successfully",
    data: result
  });
});
var updateCourseStatus = catchAsync_default(async (req, res) => {
  const adminId = req.user.id;
  const { id } = req.params;
  const { status } = req.body;
  const result = await AdminService.updateCourseStatusInDB(adminId, id, status, req);
  sendResponse_default(res, {
    statusCode: httpStatus15.OK,
    success: true,
    message: "Course status updated successfully",
    data: result
  });
});
var AdminController = {
  getStudents,
  getInstructors,
  updateUserRole,
  updateUserStatus,
  getPendingInstructors,
  getSettings,
  updateSetting,
  getReports,
  updateReportStatus,
  getAuditLogs,
  getPendingCourses,
  getAllCourses: getAllCourses2,
  updateCourseStatus
};

// src/modules/admin/admin.route.ts
var router15 = Router15();
router15.get(
  "/students",
  requirePermission(PERMISSIONS.USER_VIEW),
  AdminController.getStudents
);
router15.get(
  "/instructors",
  requirePermission(PERMISSIONS.USER_VIEW),
  AdminController.getInstructors
);
router15.patch(
  "/users/:id/role",
  requirePermission(PERMISSIONS.USER_MANAGE_ROLE),
  AdminController.updateUserRole
);
router15.patch(
  "/users/:id/status",
  requirePermission(PERMISSIONS.USER_MANAGE_ROLE),
  AdminController.updateUserStatus
);
router15.get(
  "/pending-instructors",
  requirePermission(PERMISSIONS.USER_MANAGE_ROLE),
  AdminController.getPendingInstructors
);
router15.get(
  "/settings",
  requirePermission(PERMISSIONS.SYSTEM_MANAGE),
  AdminController.getSettings
);
router15.post(
  "/settings",
  requirePermission(PERMISSIONS.SYSTEM_MANAGE),
  AdminController.updateSetting
);
router15.get(
  "/reports",
  requirePermission(PERMISSIONS.USER_VIEW),
  AdminController.getReports
);
router15.patch(
  "/reports/:id/status",
  requirePermission(PERMISSIONS.USER_MANAGE_ROLE),
  AdminController.updateReportStatus
);
router15.get(
  "/audit-logs",
  requirePermission(PERMISSIONS.USER_VIEW),
  AdminController.getAuditLogs
);
router15.get(
  "/courses",
  requirePermission(PERMISSIONS.USER_VIEW),
  AdminController.getAllCourses
);
router15.get(
  "/courses/pending",
  requirePermission(PERMISSIONS.USER_VIEW),
  AdminController.getPendingCourses
);
router15.patch(
  "/courses/:id/status",
  requirePermission(PERMISSIONS.USER_MANAGE_ROLE),
  AdminController.updateCourseStatus
);
var AdminRoutes = router15;

// src/modules/mentor/mentor.route.ts
import { Router as Router16 } from "express";

// src/modules/mentor/mentor.controller.ts
import httpStatus16 from "http-status";

// src/modules/mentor/mentor.service.ts
var getAllMentorsFromDB = async () => {
  const result = await prisma.mentor.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          role: true
        }
      }
    }
  });
  return result;
};
var getMentorDetailsFromDB = async (id) => {
  const result = await prisma.mentor.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          courses: {
            where: { status: "PUBLISHED" },
            select: { id: true, title: true, thumbnailUrl: true }
          }
        }
      }
    }
  });
  return result;
};
var MentorService = {
  getAllMentorsFromDB,
  getMentorDetailsFromDB
};

// src/modules/mentor/mentor.controller.ts
var getAllMentors = catchAsync_default(async (req, res) => {
  const result = await MentorService.getAllMentorsFromDB();
  sendResponse_default(res, {
    statusCode: httpStatus16.OK,
    success: true,
    message: "Mentors retrieved successfully",
    data: result
  });
});
var getMentorDetails = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const result = await MentorService.getMentorDetailsFromDB(id);
  sendResponse_default(res, {
    statusCode: httpStatus16.OK,
    success: true,
    message: "Mentor details retrieved successfully",
    data: result
  });
});
var MentorController = {
  getAllMentors,
  getMentorDetails
};

// src/modules/mentor/mentor.route.ts
var router16 = Router16();
router16.get("/", MentorController.getAllMentors);
router16.get("/:id", MentorController.getMentorDetails);
var MentorRoutes = router16;

// src/modules/support/support.route.ts
import { Router as Router17 } from "express";

// src/modules/support/support.controller.ts
import httpStatus17 from "http-status";

// src/modules/support/support.service.ts
var createSupportTicketInDB = async (payload) => {
  const details = JSON.stringify({
    name: payload.name,
    email: payload.email,
    subject: payload.subject
  });
  const result = await prisma.report.create({
    data: {
      reporterId: payload.reporterId ?? null,
      targetType: "SUPPORT_TICKET",
      targetId: "SYSTEM",
      reason: payload.message,
      description: details,
      status: "OPEN"
    }
  });
  return result;
};
var getMySupportTicketsFromDB = async (userId) => {
  const result = await prisma.report.findMany({
    where: { reporterId: userId, targetType: "SUPPORT_TICKET" },
    orderBy: { createdAt: "desc" }
  });
  return result;
};
var SupportService = {
  createSupportTicketInDB,
  getMySupportTicketsFromDB
};

// src/modules/support/support.controller.ts
var createTicket = catchAsync_default(async (req, res) => {
  const userId = req.user?.id;
  const result = await SupportService.createSupportTicketInDB({
    ...req.body,
    reporterId: userId
  });
  sendResponse_default(res, {
    statusCode: httpStatus17.CREATED,
    success: true,
    message: "Support ticket created successfully. Our team will contact you soon.",
    data: result
  });
});
var getMyTickets = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  const result = await SupportService.getMySupportTicketsFromDB(userId);
  sendResponse_default(res, {
    statusCode: httpStatus17.OK,
    success: true,
    message: "Support tickets retrieved successfully",
    data: result
  });
});
var SupportController = {
  createTicket,
  getMyTickets
};

// src/modules/support/support.route.ts
var router17 = Router17();
router17.post("/ticket", SupportController.createTicket);
router17.get("/my-tickets", requireAuth, SupportController.getMyTickets);
var SupportRoutes = router17;

// src/modules/review/review.route.ts
import { Router as Router18 } from "express";

// src/modules/review/review.controller.ts
import httpStatus18 from "http-status";

// src/modules/review/review.service.ts
var createReviewIntoDB = async (payload) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: payload.userId,
        courseId: payload.courseId
      }
    }
  });
  if (!enrollment) {
    throw new Error("You must be enrolled in this course to leave a review.");
  }
  const existingReview = await prisma.review.findUnique({
    where: {
      userId_courseId: {
        userId: payload.userId,
        courseId: payload.courseId
      }
    }
  });
  if (existingReview) {
    throw new Error("You have already reviewed this course.");
  }
  const result = await prisma.review.create({
    data: payload,
    include: {
      user: { select: { name: true, image: true } }
    }
  });
  return result;
};
var updateReviewInDB = async (id, userId, payload) => {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review || review.userId !== userId) {
    throw new Error("Unauthorized to update this review.");
  }
  const data = {};
  if (payload.rating !== void 0) data.rating = payload.rating;
  if (payload.comment !== void 0) data.comment = payload.comment;
  if (payload.isRecommended !== void 0) data.isRecommended = payload.isRecommended;
  if (Object.keys(data).length === 0) {
    throw new Error("No valid review fields provided for update.");
  }
  const result = await prisma.review.update({
    where: { id },
    data
  });
  return result;
};
var deleteReviewFromDB = async (id, userId, role) => {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw new Error("Review not found.");
  if (review.userId !== userId && role !== "ADMIN") {
    throw new Error("Unauthorized to delete this review.");
  }
  const result = await prisma.review.delete({
    where: { id }
  });
  return result;
};
var getCourseReviewsFromDB = async (courseId) => {
  const reviews = await prisma.review.findMany({
    where: { courseId, isHidden: false },
    include: {
      user: { select: { id: true, name: true, image: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  const total = reviews.length;
  const avg = total > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage: total > 0 ? reviews.filter((r) => r.rating === star).length / total * 100 : 0
  }));
  return {
    reviews,
    stats: {
      averageRating: Number(avg.toFixed(1)),
      totalReviews: total,
      distribution
    }
  };
};
var getInstructorReviewsFromDB = async (instructorId) => {
  const result = await prisma.review.findMany({
    where: {
      course: {
        instructorId
      }
    },
    include: {
      user: { select: { name: true, image: true } },
      course: { select: { title: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  return result;
};
var getAllReviewsForAdminFromDB = async () => {
  const result = await prisma.review.findMany({
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  return result;
};
var moderateReviewInDB = async (id, isHidden) => {
  const result = await prisma.review.update({
    where: { id },
    data: { isHidden }
  });
  return result;
};
var ReviewService = {
  createReviewIntoDB,
  updateReviewInDB,
  deleteReviewFromDB,
  getCourseReviewsFromDB,
  getInstructorReviewsFromDB,
  getAllReviewsForAdminFromDB,
  moderateReviewInDB
};

// src/modules/review/review.controller.ts
var createReview = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  const { courseId } = req.params;
  const result = await ReviewService.createReviewIntoDB({
    ...req.body,
    userId,
    courseId
  });
  sendResponse_default(res, {
    statusCode: httpStatus18.CREATED,
    success: true,
    message: "Review submitted successfully",
    data: result
  });
});
var getCourseReviews = catchAsync_default(async (req, res) => {
  const { courseId } = req.params;
  const result = await ReviewService.getCourseReviewsFromDB(courseId);
  sendResponse_default(res, {
    statusCode: httpStatus18.OK,
    success: true,
    message: "Reviews retrieved successfully",
    data: result
  });
});
var updateReview = catchAsync_default(async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id;
  const result = await ReviewService.updateReviewInDB(reviewId, userId, req.body);
  sendResponse_default(res, {
    statusCode: httpStatus18.OK,
    success: true,
    message: "Review updated successfully",
    data: result
  });
});
var deleteReview = catchAsync_default(async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id;
  const role = req.user.role;
  const result = await ReviewService.deleteReviewFromDB(reviewId, userId, role);
  sendResponse_default(res, {
    statusCode: httpStatus18.OK,
    success: true,
    message: "Review deleted successfully",
    data: result
  });
});
var getInstructorReviews = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  const result = await ReviewService.getInstructorReviewsFromDB(userId);
  sendResponse_default(res, {
    statusCode: httpStatus18.OK,
    success: true,
    message: "Instructor reviews retrieved successfully",
    data: result
  });
});
var getAllReviews = catchAsync_default(async (req, res) => {
  const result = await ReviewService.getAllReviewsForAdminFromDB();
  sendResponse_default(res, {
    statusCode: httpStatus18.OK,
    success: true,
    message: "All reviews retrieved successfully",
    data: result
  });
});
var moderateReview = catchAsync_default(async (req, res) => {
  const { reviewId } = req.params;
  const { isHidden } = req.body;
  const result = await ReviewService.moderateReviewInDB(reviewId, isHidden);
  sendResponse_default(res, {
    statusCode: httpStatus18.OK,
    success: true,
    message: `Review ${isHidden ? "hidden" : "unhidden"} successfully`,
    data: result
  });
});
var ReviewController = {
  createReview,
  getCourseReviews,
  updateReview,
  deleteReview,
  getInstructorReviews,
  getAllReviews,
  moderateReview
};

// src/middlewares/auth.ts
import httpStatus19 from "http-status";
var authMiddleware = (...requiredRoles) => {
  return catchAsync_default(async (req, res, next) => {
    const session = await auth.api.getSession({
      headers: req.headers
    });
    if (!session) {
      return res.status(httpStatus19.UNAUTHORIZED).json({
        success: false,
        message: "You are not authorized!"
      });
    }
    const user = session.user;
    if (requiredRoles.length) {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { role: true }
      });
      if (!dbUser || !requiredRoles.includes(dbUser.role)) {
        return res.status(httpStatus19.FORBIDDEN).json({
          success: false,
          message: "You do not have permission to access this resource!"
        });
      }
    }
    req.user = user;
    next();
  });
};
var auth_default = authMiddleware;

// src/modules/review/review.route.ts
var router18 = Router18();
router18.get("/course/:courseId", ReviewController.getCourseReviews);
router18.post(
  "/course/:courseId",
  requirePermission(PERMISSIONS.ENROLLMENT_VIEW_OWN),
  // Enrolled students can review
  ReviewController.createReview
);
router18.patch(
  "/:reviewId",
  auth_default(),
  ReviewController.updateReview
);
router18.delete(
  "/:reviewId",
  auth_default(),
  ReviewController.deleteReview
);
router18.get(
  "/instructor",
  requirePermission(PERMISSIONS.COURSE_VIEW_OWN),
  ReviewController.getInstructorReviews
);
router18.get(
  "/admin",
  requirePermission(PERMISSIONS.REVIEW_MANAGE),
  ReviewController.getAllReviews
);
router18.patch(
  "/:reviewId/moderate",
  requirePermission(PERMISSIONS.REVIEW_MANAGE),
  ReviewController.moderateReview
);
var ReviewRoutes = router18;

// src/routes/index.ts
var router19 = Router19();
var moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes
  },
  {
    path: "/users",
    route: UserRoutes
  },
  {
    path: "/categories",
    route: CategoryRoutes
  },
  {
    path: "/courses",
    route: CourseRoutes
  },
  {
    path: "/lessons",
    route: LessonRoutes
  },
  {
    path: "/enrollments",
    route: EnrollmentRoutes
  },
  {
    path: "/dashboard",
    route: DashboardRoutes
  },
  {
    path: "/ai",
    route: AIRoutes
  },
  {
    path: "/notifications",
    route: NotificationRoutes
  },
  {
    path: "/upload",
    route: UploadRoutes
  },
  {
    path: "/assignments",
    route: AssignmentRoutes
  },
  {
    path: "/orders",
    route: OrderRoutes
  },
  {
    path: "/classes",
    route: LiveClassRoutes
  },
  {
    path: "/messages",
    route: MessageRoutes
  },
  {
    path: "/admin",
    route: AdminRoutes
  },
  {
    path: "/mentors",
    route: MentorRoutes
  },
  {
    path: "/support",
    route: SupportRoutes
  },
  {
    path: "/reviews",
    route: ReviewRoutes
  }
];
moduleRoutes.forEach((route) => router19.use(route.path, route.route));
var routes_default = router19;

// src/middlewares/globalErrorHandler.ts
import { ZodError } from "zod";
var globalErrorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorSources = [
    {
      path: "",
      message: "Something went wrong"
    }
  ];
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    errorSources = err.issues.map((issue) => ({
      path: issue.path[issue.path.length - 1],
      message: issue.message
    }));
  } else if (err instanceof Error) {
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err.message
      }
    ];
  }
  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config_default.NODE_ENV === "development" ? err?.stack : null
  });
};
var globalErrorHandler_default = globalErrorHandler;

// src/middlewares/notFound.ts
import httpStatus20 from "http-status";
var notFound = (req, res, next) => {
  return res.status(httpStatus20.NOT_FOUND).json({
    success: false,
    message: "API Not Found !!",
    error: ""
  });
};
var notFound_default = notFound;

// src/app.ts
var app = express16();
app.use(cookieParser());
app.use(cors({
  origin: [
    config_default.FRONTEND_URL,
    config_default.BACKEND_BASE_URL,
    config_default.BETTER_AUTH_URL,
    "http://localhost:3000",
    "http://localhost:5000"
  ].filter(Boolean),
  credentials: true
}));
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use(express16.json());
var authLimiter = rateLimit({
  windowMs: 60 * 1e3,
  max: 10,
  message: "Too many auth attempts"
});
app.use("/api/v1/auth", authLimiter);
app.use("/api/v1", routes_default);
app.get("/", (req, res) => {
  res.send("Hello! Welcome to the EduBridge API.");
});
app.use(notFound_default);
app.use(globalErrorHandler_default);
var app_default = app;

// src/vercel.ts
var vercel_default = app_default;
export {
  vercel_default as default
};
