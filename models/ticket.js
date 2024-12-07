import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    seatNumber: { type: Number, required: true },
    issuedAt: { type: Date, default: Date.now },
    passengerName: { type: String, required: true },
    price: { type: Number, required: true }, // Ticket price for revenue tracking
});

export default mongoose.model('Ticket', ticketSchema);
