import { Router } from 'express';
import { PERMISSIONS } from '../../config/permissions';
import { requirePermission } from '../../middlewares/permission';
import validateRequest from '../../middlewares/validateRequest';
import { QuizController } from './quiz.controller';
import { QuizValidations } from './quiz.validation';

const router: Router = Router();

router.get('/course/:courseId', requirePermission(PERMISSIONS.QUIZ_CREATE), QuizController.getQuizzesByCourse);

router.post(
  '/',
  requirePermission(PERMISSIONS.QUIZ_CREATE),
  validateRequest(QuizValidations.createQuizZodSchema),
  QuizController.createQuiz
);

router.get('/:id/results', requirePermission(PERMISSIONS.QUIZ_CREATE), QuizController.getQuizResults);

router.patch(
  '/:id',
  requirePermission(PERMISSIONS.QUIZ_CREATE),
  validateRequest(QuizValidations.updateQuizZodSchema),
  QuizController.updateQuiz
);

router.delete('/:id', requirePermission(PERMISSIONS.QUIZ_CREATE), QuizController.deleteQuiz);

export const QuizRoutes = router;
