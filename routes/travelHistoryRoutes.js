import express from 'express';
import { getTravelHistory } from '../controllers/travelHistoryController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

// Get travel history for the authenticated user
router.get('/user', authenticateToken, getTravelHistory);

// Get travel history by email (admin use case or searching)

export default router;
