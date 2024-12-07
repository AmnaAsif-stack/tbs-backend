import Stripe from 'stripe';
import Booking from '../models/booking.js';

const stripe = new Stripe('sk_test_51QQtJrGVhVkfmBm6oLFDPAxVIc1M2yGSRpCOtaWwAj08ir3TdqjzOWHXrpGkuicMkugxMC33syH6eXImrTR0A1tP00VUwgizYW'); // Replace with your Stripe Secret Key


export const processPayment = async (req, res) => {
    try {
        const { bookingId, paymentMethodId } = req.body;

        // Find booking by bookingId
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if the total fare is valid
        if (booking.totalFare <= 0) {
            return res.status(400).json({ message: 'Invalid fare amount' });
        }

        // Create payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: booking.totalFare * 100, // Stripe expects the amount in the smallest currency unit (cents)
            currency: 'usd', // You can change this depending on your desired currency
            payment_method: paymentMethodId,
            automatic_payment_methods: {
                enabled: true, // Use automatic payment methods to handle different payment types
                allow_redirects: 'never',  // Disable redirect-based payment methods
            },
            confirm: true, // Automatically confirm the payment
        });

        // If payment is successful, update booking with payment details
        if (paymentIntent.status === 'succeeded') {
            booking.paymentStatus = 'completed';
            booking.paymentDate = new Date();
            await booking.save();
            return res.status(200).json({
                message: 'Payment successful',
                paymentIntent: paymentIntent,
                booking: booking,
            });
        }

        return res.status(400).json({ message: 'Payment failed', status: paymentIntent.status });
    } catch (error) {
        // Log the error more explicitly for debugging
        console.error('Error in processPayment:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};
