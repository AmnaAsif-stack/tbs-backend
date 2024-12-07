// controllers/refundController.js
import Refund from '../models/Refund.js';
import Booking from '../models/booking.js';

// Handle refund request
export const requestRefund = async (req, res) => {
    try {
        const { bookingId, reason } = req.body;

        // Validate that the booking exists
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // If the booking already has a refund request, prevent duplicate request
        const existingRefund = await Refund.findOne({ booking: bookingId });
        if (existingRefund) {
            return res.status(400).json({ message: 'Refund request already made for this booking' });
        }

        // Calculate refund amount (for simplicity, assume a full refund here)
        const refundAmount = booking.totalFare;

        // Create a new refund document
        const newRefund = new Refund({
            booking: bookingId,
            refundAmount,
            reason
        });

        // Save the refund document
        await newRefund.save();

        res.status(201).json({
            message: 'Refund request created successfully',
            refund: newRefund
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Approve or reject refund
export const processRefund = async (req, res) => {
    try {
        const { refundId, status } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Must be "approved" or "rejected".' });
        }

        // Find the refund request
        const refund = await Refund.findById(refundId);
        if (!refund) {
            return res.status(404).json({ message: 'Refund request not found' });
        }

        // Update refund status and processed date
        refund.refundStatus = status;
        refund.processedDate = new Date();

        // Save the updated refund
        await refund.save();

        res.status(200).json({
            message: `Refund request ${status} successfully`,
            refund
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
