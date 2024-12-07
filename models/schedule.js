import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
    route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
    bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
    departureTime: { type: Date, required: true },
    arrivalTime: { type: Date, required: true },
    status: { type: String, enum: ['Scheduled', 'In Progress', 'Completed'], default: 'Scheduled' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

scheduleSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('Schedule', scheduleSchema);
