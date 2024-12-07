// models/passenger.js
import mongoose from 'mongoose';

const passengerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    passportNumber: { type: String },
    phone: { type: String },
    address: { type: String },
    dateOfBirth: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

const Passenger = mongoose.model('Passenger', passengerSchema);
export default Passenger;
