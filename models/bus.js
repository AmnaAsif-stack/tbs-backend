import mongoose from 'mongoose';

const busSchema = new mongoose.Schema({
    licensePlate: { type: String, required: true, unique: true },
    capacity: { type: Number, required: true },
    type: { type: String, enum: ['AC', 'Non-AC'], default: 'Non-AC' },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    status: { type: String, enum: ['Active', 'Inactive', 'Maintenance'], default: 'Active' }, // New field
    assignedRoute: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', default: null }, // New field
    features: [{ type: String }] // E.g., WiFi, Recliner Seats
});

export default mongoose.model('Bus', busSchema);
