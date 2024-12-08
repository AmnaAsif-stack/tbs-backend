// routes/feedbackRoutes.js
import express from 'express';
import { submitFeedback, getFeedbackByCustomer, getAllFeedbacks, updateFeedback ,deleteFeedback} from '../controllers/feedbackController.js';
import { authenticateToken } from '../middleware/auth.js';
const router = express.Router();

// Route for submitting feedback
router.post('/submit',authenticateToken,submitFeedback);

// Route for viewing feedback by a specific customer (for customers to see their own feedback)
router.get('/view/:email',authenticateToken, getFeedbackByCustomer);

// Route for viewing all feedback (Admin view)
router.get('/view-all', getAllFeedbacks);

// Route for updating feedback (Admin only, to update status or response)
router.put('/update/:feedbackId', updateFeedback);
router.delete('/delete/:feedbackId', deleteFeedback);

export default router;
