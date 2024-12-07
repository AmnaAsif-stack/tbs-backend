// models/refund.js
import mongoose from 'mongoose';

const refundSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    refundAmount: {
        type: Number,
        required: true
    },
    refundStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    reason: {
        type: String,
        required: true
    },
    requestDate: {
        type: Date,
        default: Date.now
    },
    processedDate: {
        type: Date
    }
});

const Refund = mongoose.model('Refund', refundSchema);

export default Refund;
