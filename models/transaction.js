import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    type: { type: String, enum: ['expense', 'revenue'], required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    associatedId: { type: mongoose.Schema.Types.ObjectId }, // Reference to related entity like a Schedule or Ticket
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Transaction', transactionSchema);
