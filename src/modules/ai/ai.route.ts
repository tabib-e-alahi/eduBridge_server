import express from 'express';
import { requirePermission } from '../../middlewares/permission';
import { PERMISSIONS } from '../../config/permissions';
import validateRequest from '../../middlewares/validateRequest';
import { AIController } from './ai.controller';
import { AIValidations } from './ai.validation';

const router = express.Router();

router.post(
  '/learning-path',
  requirePermission(PERMISSIONS.AI_ROADMAP_USE),
  validateRequest(AIValidations.learningPathSchema),
  AIController.generateLearningPath
);

router.get(
  '/learning-path/my',
  requirePermission(PERMISSIONS.AI_ROADMAP_USE),
  AIController.getUserLearningPaths
);

router.post(
  '/course-recommendations',
  requirePermission(PERMISSIONS.AI_ROADMAP_USE),
  validateRequest(AIValidations.courseRecommendationsSchema),
  AIController.getCourseRecommendations
);

router.post(
  '/quiz-generator',
  requirePermission(PERMISSIONS.AI_QUIZ_USE),
  validateRequest(AIValidations.quizGeneratorSchema),
  AIController.generateQuiz
);

router.post(
  '/chat',
  requirePermission(PERMISSIONS.AI_TUTOR_USE),
  validateRequest(AIValidations.aiChatSchema),
  AIController.chatWithAI
);

router.get(
  '/conversations',
  requirePermission(PERMISSIONS.AI_TUTOR_USE),
  AIController.getConversations
);

router.get(
  '/conversations/:id',
  requirePermission(PERMISSIONS.AI_TUTOR_USE),
  AIController.getConversationById
);

router.post(
  '/progress-analyzer',
  requirePermission(PERMISSIONS.AI_TUTOR_USE),
  validateRequest(AIValidations.progressAnalyzerSchema),
  AIController.analyzeProgress
);

export const AIRoutes = router;
