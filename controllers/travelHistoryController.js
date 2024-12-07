import Booking from '../models/booking.js';
import Route from '../models/routes.js';
import Schedule from '../models/schedule.js';

export const getTravelHistory = async (req, res) => {
    try {
        // Fetch bookings of the user, populated with the route and schedule details
        const bookings = await Booking.find({ customerEmail: req.user.email })
                                      .populate('route')
                                      .populate('schedule');

        // If no bookings are found, send a response with an appropriate message
        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: "No travel history found for this user." });
        }

        // Map the bookings to include route, schedule, and payment status
        const travelHistory = bookings.map(booking => {
            // Check if route is null or undefined
            if (!booking.route) {
                console.warn(`Skipping booking with missing route: ${booking._id}`);
                return null;  // Skip this booking if the route is missing
            }

            return {
                source: booking.route.source,
                destination: booking.route.destination,
                travelDate: booking.schedule.departureTime,
                ticketNumber: booking._id.toString(),
                fare: booking.totalFare,
                status: booking.paymentStatus === 'completed' ? 'Completed' : 'Pending'
            };
        }).filter(history => history !== null);  // Remove any null values from the result

        // If no valid travel history is found, return a not found response
        if (!travelHistory.length) {
            return res.status(404).json({ message: "No travel history found for this user." });
        }

        // Send the response with the travel history
        res.status(200).json(travelHistory);
        
    } catch (error) {
        console.error('Error fetching travel history:', error);
        res.status(500).json({ message: "Error fetching travel history" });
    }
};
