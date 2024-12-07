import Booking from '../models/booking.js';

// Create a new booking
export const createBooking = async (req, res) => {
    try {
        const { customerName, customerEmail, route, schedule, seatsBooked, totalFare, paymentStatus, paymentDate } = req.body;

        const newBooking = new Booking({
            customerName,
            customerEmail,
            route,
            schedule,
            seatsBooked,
            totalFare,
            paymentStatus,
            paymentDate,
        });

        await newBooking.save();
        res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        res.status(400).json({ message: 'Error creating booking', error: error.message });
    }
};

// Get all bookings
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('route schedule'); // Populate related data
        res.status(200).json(bookings);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching bookings', error: error.message });
    }
};

// Get a single booking by ID
export const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('route schedule');
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        if (booking.schedule) {
            const { departureTime, arrivalTime } = booking.schedule;

            // If necessary, you can add additional logic here to manipulate these times or return them separately
            booking.schedule = { departureTime, arrivalTime };
        }

        res.status(200).json(booking);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching booking', error: error.message });
    }
};

// Update a booking by ID
export const updateBooking = async (req, res) => {
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Return the updated document
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking updated successfully', booking: updatedBooking });
    } catch (error) {
        res.status(400).json({ message: 'Error updating booking', error: error.message });
    }
};

// Delete a booking by ID
export const deleteBooking = async (req, res) => {
    try {
        const deletedBooking = await Booking.findByIdAndDelete(req.params.id);

        if (!deletedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting booking', error: error.message });
    }
};
