import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
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
import bookingRoutes from './routes/bookingRoutes.js'
import fs from 'fs';
import path from 'path';
import pdfkit from 'pdfkit'; 
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

// Routes
app.use('/api/routes', routeRoutes);
app.use('/', busScheduleRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/addBus',addBus);
app.use('/api/tickets', ticketRoutes);
app.use('/api/payments', paymentRoutes); // Set up payment route
app.use('/api/refunds', refundRoutes);
app.use('/api/passengers', passengerRoutes);
app.use('api',travelHistory);
app.use('/api', fareRoutes);
app.use('/api',bookingRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Bus Schedule API');
});

// Global Error Handling Middleware
app.use(errorMiddleware);

// Connect to MongoDB
mongoose.connect(process.env.MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.error("MongoDB connection error:", error));

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
