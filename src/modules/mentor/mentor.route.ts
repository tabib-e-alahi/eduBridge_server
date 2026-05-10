import express from 'express';
import { MentorController } from './mentor.controller';

const router = express.Router();

router.get('/', MentorController.getAllMentors);
router.get('/:id', MentorController.getMentorDetails);

export const MentorRoutes = router;
