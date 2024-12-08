import express from 'express';
import mongoose from 'mongoose';
import Passenger from './models/Passenger.js';
import cors from 'cors';
import User from './models/user.js';
import userRoutes from './routes/userRoutes.js';
import routeRoutes from './routes/routeRoutes.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import dotenv from 'dotenv';
import busScheduleRoutes from './routes/busScheduleRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import { addBus } from './controllers/busController.js';
import ticketRoutes from './routes/ticketRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js'; // Import payment routes
import refundRoutes from './routes/refundRoutes.js';
import passengerRoutes from './routes/passengerRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import travelHistory from './models/travelHistory.js';
import fareRoutes from './routes/fareRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import authenticateToken from './middleware/auth.js';
import fs from 'fs';
import path from 'path';
import pdfkit from 'pdfkit'; 
import Stripe from 'stripe';
import bodyParser from 'body-parser';
import booking from './models/booking.js';
const stripe = new Stripe('sk_test_51QQtJrGVhVkfmBm6oLFDPAxVIc1M2yGSRpCOtaWwAj08ir3TdqjzOWHXrpGkuicMkugxMC33syH6eXImrTR0A1tP00VUwgizYW'); // Replace with your Stripe Secret Key

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

// Routes
app.use('/api', userRoutes);
const router = express.Router();
app.use('/api/routes', routeRoutes);
app.use('/', busScheduleRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/addBus', addBus);
app.use('/api/tickets', ticketRoutes);
app.use('/api/payments', paymentRoutes); // Set up payment route
app.use('/api/refunds', refundRoutes);
app.use('/api/passengers', passengerRoutes);
app.use('api', travelHistory);
app.use('/api', fareRoutes);
app.use('/api', bookingRoutes);
app.use('/api/feedback', feedbackRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Bus Schedule API');
});

app.use(bodyParser.json());
app.put('/update-profile', authenticateToken, async (req, res) => {
  const { name, email, passportNumber, phone, address, dateOfBirth } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user details
    user.name = name || user.name;
    user.email = email || user.email;

    // Save the user data
    await user.save();

    // Now update the passenger details
    const passenger = await Passenger.findOne({ userId: req.user.id });

    if (!passenger) {
      // If no passenger record exists, create a new one
      const newPassenger = new Passenger({
        userId: req.user.id,
        passportNumber,
        phone,
        address,
        dateOfBirth,
      });
      await newPassenger.save();
    } else {
      // If passenger record exists, update the existing details
      passenger.passportNumber = passportNumber || passenger.passportNumber;
      passenger.phone = phone || passenger.phone;
      passenger.address = address || passenger.address;
      passenger.dateOfBirth = dateOfBirth || passenger.dateOfBirth;

      await passenger.save();
    }

    // Return the updated user and passenger details
    res.json({ message: 'Profile updated successfully', user, passenger });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
app.post('/api/payments/create-intent', async (req, res) => {
  try {
    const { bookingId, amount } = req.body; // Destructure bookingId and amount from the request

    if (!bookingId || !amount) {
      return res.status(400).send({ error: 'Booking ID and amount are required.' });
    }

    // Create payment intent with the amount (in cents, Stripe expects the amount in the smallest unit)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert the amount to cents (e.g., ₹500 = 50000 cents)
      currency: 'inr', // Assuming you're processing payments in INR
      metadata: { bookingId },
    });

    // Respond with the client secret to the frontend
    res.status(200).send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send({ error: 'Failed to create payment intent.' });
  }
});
// In your backend (Express.js)
app.get('/api/passenger', authenticateToken, async (req, res) => {
  try {
    const passenger = await Passenger.findOne({ userId: req.user.id });
    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }
    res.json(passenger);
  } catch (error) {
    console.error('Error fetching passenger data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Route to update the payment status of a booking
app.put('/api/bookings/:bookingId/update-payment-status', async (req, res) => {
  const { bookingId } = req.params; // Get the bookingId from the URL parameters
  const { paymentStatus } = req.body; // Expect the paymentStatus from the request body

  try {
    // Check if the paymentStatus is valid
    if (!['pending', 'completed', 'failed'].includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }

    // Find and update the booking's payment status
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId, // Find booking by ID
      { paymentStatus }, // Update payment status
      { new: true } // Return the updated document
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Return the updated booking info
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Global Error Handling Middleware
app.use(errorMiddleware);




// Create Payment Intent Endpoint
app.post('/create-payment-intent', async (req, res) => {
  const { paymentMethodId, bookingId } = req.body;
  console.log('Received payment intent request with paymentMethodId:', paymentMethodId, ' and bookingId:', bookingId);

  try {
    // Fetch booking details from the database
    const Booking = await booking.findById(bookingId);

    if (!Booking) {
      console.log('Booking not found:', bookingId);
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Log booking details
    console.log('Booking found:', booking);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 150000,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true, // Automatically confirm the PaymentIntent
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never', // Prevent redirects, if preferred
      },
      description: 'Payment for booking', // Optional description
    });
    

    console.log('Payment Intent created:', paymentIntent);

    if (paymentIntent.status === 'succeeded') {
      Booking.paymentStatus = 'completed';
      Booking.paymentDate = new Date();
      await Booking.save();

      return res.status(200).json({
        message: 'Payment successful',
        paymentIntent: paymentIntent,
        booking: Booking,
      });
    }

    return res.status(400).json({ message: 'Payment failed', status: paymentIntent.status });

  } catch (error) {
    console.error('Error creating payment intent:', error);  // Log the error
    res.status(500).send('Error creating payment intent');
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.error("MongoDB connection error:", error));

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
