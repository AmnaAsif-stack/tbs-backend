// routes/passengerRoutes.js
import express from 'express';
import {
    addPassenger,
    updatePassenger,
    getAllPassengers,
    getPassengerById,
    deletePassenger
} from '../controllers/passengerController.js';
import authenticateToken from '../middleware/auth.js'; // Authentication middleware

const router = express.Router();

// Add a new passenger
router.post('/add', authenticateToken, addPassenger);

// Update passenger details
router.get('/', authenticateToken, getAllPassengers);

// Get all passengers
router.get('/', authenticateToken, getAllPassengers);

// Get a specific passenger by ID
router.get('/:id', authenticateToken, getPassengerById);

// Delete a passenger
router.delete('/:id', authenticateToken, deletePassenger);

export default router;
