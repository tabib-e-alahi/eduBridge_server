import { geminiModel } from '../../lib/ai';
import { prisma } from '../../lib/prisma';

// --- Helpers ---

/**
 * Sanitize user input before prompt interpolation.
 * Trims whitespace, limits to 2000 chars, and strips backtick/injection patterns.
 */
const sanitizeInput = (str: string): string => {
  return str
    .trim()
    .slice(0, 2000)
    .replace(/```/g, '')
    .replace(/\$\{/g, '')
    .replace(/<script[^>]*>/gi, '')
    .replace(/<\/script>/gi, '');
};

/**
 * Log AI request with real token usage from Gemini response.
 */
const logAIRequest = async (
  userId: string,
  feature: string,
  promptTokens: number = 0,
  completionTokens: number = 0,
  model: string = 'gemini-1.5-flash'
) => {
  return await prisma.aIRequestLog.create({
    data: {
      userId,
      feature,
      model,
      promptTokens,
      completionTokens,
    },
  });
};

/**
 * Extract token usage from a Gemini generateContent result.
 */
const extractTokenUsage = (result: any) => {
  const usage = result.response.usageMetadata;
  return {
    promptTokens: usage?.promptTokenCount || 0,
    completionTokens: usage?.candidatesTokenCount || 0,
  };
};

// --- Service Functions ---

const generateLearningPath = async (userId: string, payload: any) => {
  const goal = sanitizeInput(payload.goal || '');
  const currentLevel = sanitizeInput(payload.currentLevel || '');
  const weeklyHours = Number(payload.weeklyHours) || 5;
  const learningStyle = sanitizeInput(payload.learningStyle || '');

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
  const roadmapData = JSON.parse(text.replace(/```json|```/g, '').trim());

  await logAIRequest(userId, 'learning-path', promptTokens, completionTokens);

  const learningPath = await prisma.learningPath.create({
    data: {
      userId,
      title: roadmapData.roadmapTitle,
      goal: goal,
      steps: roadmapData,
    },
  });

  // Send notification (async)
  const NotificationService = (await import('../notification/notification.service')).default;
  NotificationService.notifyLearningPathGenerated(userId, roadmapData.roadmapTitle);

  return learningPath;
};

const getCourseRecommendations = async (userId: string, interests: string[], level?: string) => {
  const courses = await prisma.course.findMany({ where: { status: 'PUBLISHED' }, select: { title: true, slug: true, level: true } });
  const courseContext = courses.map(c => `- ${c.title} (${c.level})`).join('\n');

  const sanitizedInterests = interests.map(i => sanitizeInput(i)).join(', ');
  const sanitizedLevel = level ? sanitizeInput(level) : 'any';

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
  const data = JSON.parse(text.replace(/```json|```/g, '').trim());

  await logAIRequest(userId, 'course-recommendations', promptTokens, completionTokens);
  return data;
};

const generateQuiz = async (userId: string, topic: string, difficulty: string = 'Medium', count: number = 5) => {
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
  const quizData = JSON.parse(text.replace(/```json|```/g, '').trim());

  await logAIRequest(userId, 'quiz-generator', promptTokens, completionTokens);
  return quizData;
};

const chatWithAI = async (userId: string, payload: any) => {
  const message = sanitizeInput(payload.message || '');
  const courseContext = payload.courseContext ? sanitizeInput(payload.courseContext) : '';
  const conversationId = payload.conversationId;

  let conversation;
  if (conversationId) {
    conversation = await prisma.aIConversation.findUnique({ where: { id: conversationId } });
  }

  if (!conversation) {
    conversation = await prisma.aIConversation.create({
      data: { userId, title: message.substring(0, 30) },
    });
  }

  await prisma.aIMessage.create({
    data: { conversationId: conversation.id, role: 'user', content: message },
  });

  const previousMessages = await prisma.aIMessage.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  const history = previousMessages.reverse().map(m => `${m.role}: ${m.content}`).join('\n');

  const prompt = `You are a helpful AI Tutor on EduBridge AI.
  ${courseContext ? `Current Course Context: ${courseContext}` : ''}
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
  const data = JSON.parse(text.replace(/```json|```/g, '').trim());

  await prisma.aIMessage.create({
    data: { conversationId: conversation.id, role: 'assistant', content: data.answer },
  });

  await logAIRequest(userId, 'chat', promptTokens, completionTokens);

  return {
    conversationId: conversation.id,
    ...data,
  };
};

/**
 * Task 1.6: analyzeProgress now fetches data from DB using userId,
 * not from client-supplied payload. Prevents data injection.
 */
const analyzeProgress = async (userId: string) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: { 
      course: { select: { title: true } },
      lessonProgress: { 
        where: { isCompleted: true },
        include: { lesson: { select: { title: true } } }
      }
    },
  });

  const quizAttempts = await prisma.quizAttempt.findMany({
    where: { userId },
    include: { 
      quiz: { select: { title: true } }
    },
  });

  const prompt = `Analyze this student's data for personal career coaching:
  - Enrollments: ${JSON.stringify(enrollments.map(e => ({ 
      course: e.course.title, 
      progress: e.progress,
      status: e.status,
      completedLessons: e.lessonProgress.map(lp => lp.lesson.title)
    })))}
  - Quiz Attempts: ${JSON.stringify(quizAttempts.map(q => ({ topic: (q as any).quiz?.title || 'General', score: q.score, total: q.totalQuestions })))}
  
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
  const analysis = JSON.parse(text.replace(/```json|```/g, '').trim());

  await logAIRequest(userId, 'progress-analyzer', promptTokens, completionTokens);
  return analysis;
};

const getConversations = async (userId: string) => {
  const conversations = await prisma.aIConversation.findMany({
    where: { userId },
    include: {
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { updatedAt: 'desc' },
  });
  return conversations;
};

const getConversationById = async (userId: string, conversationId: string) => {
  const conversation = await prisma.aIConversation.findUnique({
    where: { id: conversationId, userId },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });
  return conversation;
};

const getUserLearningPaths = async (userId: string) => {
  const result = await prisma.learningPath.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return result;
};

export const AIService = {
  generateLearningPath,
  getCourseRecommendations,
  generateQuiz,
  chatWithAI,
  analyzeProgress,
  getConversations,
  getConversationById,
  getUserLearningPaths,
};
