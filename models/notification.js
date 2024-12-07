import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    message: { type: String, required: true },
    recipients: [{ type: String, required: true }], // List of emails or user IDs
    sentAt: { type: Date, default: Date.now },
    priority: { type: String, enum: ['High', 'Normal', 'Low'], default: 'Normal' }, // Admin priority levels
    status: { type: String, enum: ['Sent', 'Pending'], default: 'Sent' },
});

export default mongoose.model('Notification', notificationSchema);
