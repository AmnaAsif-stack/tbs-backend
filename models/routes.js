import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
    start: { type: String, required: true },
    end: { type: String, required: true },
    stops: [{ type: String }],
    distance: { type: Number, required: true }, // New field in kilometers
    estimatedDuration: { type: String }, // New field, e.g., "2 hours"
    buses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bus' }] // To track buses on this route
});

export default mongoose.model('Route', routeSchema);
