import mongoose from 'mongoose';

const discountSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    percentage: { type: Number, required: true, min: 1, max: 100 },
    validTill: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }, // Admin who created the discount
    usageCount: { type: Number, default: 0 }, // Track usage of discount codes
    status: { type: String, enum: ['Active', 'Expired'], default: 'Active' }, // Auto-update based on validity
});

export default mongoose.model('Discount', discountSchema);
