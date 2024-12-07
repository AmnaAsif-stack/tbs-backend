import express from 'express';

import { registerUser,
    loginUser,getUserProfile}
 from '../controllers/userController.js';
 import { authenticateToken } from '../middleware/auth.js';
 const router = express.Router();

// Signup and Login
router.post('/signup',registerUser);
router.post('/login', loginUser);

router.get('/user', authenticateToken, getUserProfile);

export default router;

