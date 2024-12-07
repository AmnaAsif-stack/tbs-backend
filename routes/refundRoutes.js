// routes/refundRoutes.js
import express from 'express';
import { requestRefund, processRefund } from '../controllers/refundController.js';
import authenticateToken from '../middleware/auth.js'; // Ensure user is authenticated
import { authorizeCustomer } from '../middleware/authorizeCustomer.js'; // Ensure user is authorized

const router = express.Router();

// Route to request a refund
router.post('/request', authenticateToken, authorizeCustomer, requestRefund);

// Route to approve or reject a refund request (admin functionality)
router.post('/process', authenticateToken, authorizeCustomer, processRefund);

export default router;
