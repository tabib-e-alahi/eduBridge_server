import express from 'express';
import { SupportController } from './support.controller';
import { requireAuth } from '../../middlewares/permission';

const router = express.Router();

// Publicly accessible for contact form
router.post('/ticket', SupportController.createTicket);

// User-specific
router.get('/my-tickets', requireAuth, SupportController.getMyTickets);

export const SupportRoutes = router;
