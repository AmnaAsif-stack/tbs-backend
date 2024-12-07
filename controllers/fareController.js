import Fare from '../models/fare.js';
import mongoose from 'mongoose';

// Controller to handle fare retrieval
export const getFare = async (req, res) => {
  try {
    const { routeId } = req.query;

    if (!routeId || !mongoose.Types.ObjectId.isValid(routeId)) {
      return res.status(400).json({ message: 'Invalid or missing routeId' });
    }

    const fareDetails = await Fare.findOne({ route: routeId });

    if (!fareDetails) {
      return res.status(404).json({ message: 'Fare not found for the specified route' });
    }

    res.status(200).json({
      message: 'Fare details retrieved successfully',
      fare: fareDetails,
    });
  } catch (error) {
    console.error('Error retrieving fare details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
