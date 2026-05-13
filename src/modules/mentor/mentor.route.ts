import express, { Router } from 'express';
import { MentorController } from './mentor.controller';

const router: Router = Router();

router.get('/', MentorController.getAllMentors);
router.get('/:id', MentorController.getMentorDetails);

export const MentorRoutes = router;
