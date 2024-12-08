import express from 'express';
import { createBooking, getAllBookings, getBookingById, updateBooking, deleteBooking } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/bookings', createBooking); // Create a booking
router.get('/bookingsall', getAllBookings); // Get all bookings
router.get('/bookings/:id', getBookingById); // Get a booking by ID
router.put('/bookings/:id', updateBooking); // Update a booking by ID
router.delete('/bookings/:id', deleteBooking); // Delete a booking by ID

export default router;
