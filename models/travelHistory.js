import mongoose from 'mongoose';

const travelHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    source: { type: String, required: true },
    destination: { type: String, required: true },
    travelDate: { type: Date, required: true },
    bookingDate: { type: Date, default: Date.now },
    ticketNumber: { type: String, required: true, unique: true },
    fare: { type: Number, required: true },
    status: { type: String, enum: ['Completed', 'Cancelled'], default: 'Completed' }
});

export default mongoose.model('TravelHistory', travelHistorySchema);
