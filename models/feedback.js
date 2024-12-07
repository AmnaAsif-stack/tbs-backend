import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    customerEmail: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Reviewed'], default: 'Pending' }, // Admin tracking
    createdAt: { type: Date, default: Date.now },
    response: { type: String, default: null }, // Admin response
});

export default mongoose.model('Feedback', feedbackSchema);
