import express from 'express';
import { bookTicket,downloadTicket } from '../controllers/ticketController.js';  // Include .js extension
import authenticateToken from '../middleware/auth.js'; // Import authenticateToken
import { authorizeCustomer } from '../middleware/authorizeCustomer.js'; // Import authorizeCustomer
import { processPayment } from '../controllers/paymentController.js';
const router = express.Router();

// Route to book a ticket
router.post('/book', authenticateToken, authorizeCustomer, bookTicket);
router.post('/payment/process', authenticateToken, authorizeCustomer, processPayment); 
router.get('/download-ticket', downloadTicket);
export default router;
