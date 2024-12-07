import mongoose from 'mongoose';

const fareSchema = new mongoose.Schema({
    route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
    baseFare: { type: Number, required: true },
    additionalFarePerStop: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }, // Track creation
    updatedAt: { type: Date, default: Date.now }, // Track updates
});

fareSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('Fare', fareSchema);
