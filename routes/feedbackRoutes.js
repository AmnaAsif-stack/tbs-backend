// routes/feedbackRoutes.js
import express from 'express';
import { submitFeedback, getFeedbackByCustomer, getAllFeedbacks, updateFeedback } from '../controllers/feedbackController.js';
import { authenticateToken } from '../middleware/auth.js';
const router = express.Router();

// Route for submitting feedback
router.post('/submit',authenticateToken,submitFeedback);

// Route for viewing feedback by a specific customer (for customers to see their own feedback)
router.get('/view/:email', getFeedbackByCustomer);

// Route for viewing all feedback (Admin view)
router.get('/admin/view-all', getAllFeedbacks);

// Route for updating feedback (Admin only, to update status or response)
router.put('/admin/update/:feedbackId', updateFeedback);

export default router;
