// controllers/feedbackController.js
import Feedback from '../models/feedback.js';

// Submit Feedback
export const submitFeedback = async (req, res) => {
    try {
        const { customerEmail, message } = req.body;
        const feedback = new Feedback({ customerEmail, message });

        await feedback.save();

        res.status(201).json({
            message: 'Feedback submitted successfully!',
            feedbackId: feedback._id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Feedback by Customer Email (for viewing)
export const getFeedbackByCustomer = async (req, res) => {
    try {
        const { email } = req.params;
        const feedbacks = await Feedback.find({ customerEmail: email });

        if (!feedbacks || feedbacks.length === 0) {
            return res.status(404).json({ message: 'No feedback found for this user' });
        }

        res.status(200).json(feedbacks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get All Feedbacks (Admin view)
export const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find();
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update Feedback (Admin response or status update)
export const updateFeedback = async (req, res) => {
    try {
        const { feedbackId } = req.params;
        const { status, response } = req.body;

        const feedback = await Feedback.findById(feedbackId);

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        if (status) feedback.status = status;
        if (response) feedback.response = response;

        await feedback.save();

        res.status(200).json({
            message: 'Feedback updated successfully',
            feedback,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete Feedback
export const deleteFeedback = async (req, res) => {
    try {
        const { feedbackId } = req.params;

        // Find and delete feedback by its ID
        const feedback = await Feedback.findByIdAndDelete(feedbackId);

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
