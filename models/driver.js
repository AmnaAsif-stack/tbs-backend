import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contactNumber: { type: String, required: true, unique: true },
    assignedBus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', default: null },
    licenseNumber: { type: String, required: true, unique: true },
    experienceYears: { type: Number, default: 0 }, // New field for experience
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }, // Status tracking
});

export default mongoose.model('Driver', driverSchema);
