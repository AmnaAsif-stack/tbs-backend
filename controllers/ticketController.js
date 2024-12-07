import Booking from '../models/booking.js';
import Route from '../models/routes.js';
import Schedule from '../models/schedule.js';
import Ticket from '../models/ticket.js';
import generateTicketPDF from '../utils/generatepdf.js'
import mongoose from 'mongoose';
import TravelHistory from '../models/travelHistory.js';

// Controller to handle booking a ticket
export const bookTicket = async (req, res) => {
    let newBooking; // Declare newBooking here to ensure it is accessible in the catch block.

    try {
        const { routeId, scheduleId, seatsBooked, totalFare, passengerName, seatNumber } = req.body;
        const userId = req.user.id;  // Assuming user ID is available via token

        // Validate IDs
        if (!mongoose.Types.ObjectId.isValid(routeId) || !mongoose.Types.ObjectId.isValid(scheduleId)) {
            return res.status(400).json({ message: "Invalid route or schedule ID format" });
        }

        console.log("Route ID:", routeId); // Debugging
        console.log("Schedule ID:", scheduleId); // Debugging

        // Validate that the route and schedule exist
        const route = await Route.findById(routeId);
        const schedule = await Schedule.findById(scheduleId);

        if (!route) {
            return res.status(404).json({ message: "Route not found" });
        }

        if (!schedule) {
            return res.status(404).json({ message: "Schedule not found" });
        }

        const newBooking = new Booking({
            customerName: passengerName,
            customerEmail: req.user.email,
            route: routeId,
            schedule: scheduleId,
            seatsBooked,
            totalFare,
        });

        await newBooking.save();

        // Create a TravelHistory document
        const newTravelHistory = new TravelHistory({
            userId: userId,
            source: route.start,  // Use `route.start` instead of `route.source`
            destination: route.end,  // Use `route.end` instead of `route.destination`
            travelDate: schedule.departureTime,  // Use the departure time from the schedule
            ticketNumber: newBooking._id.toString(),  // Using booking ID as ticket number
            fare: totalFare,
            status: 'Completed'
        });

        // Save the travel history
        await newTravelHistory.save();

        // Create tickets for each booked seat
        const tickets = [];
        for (let i = 0; i < seatsBooked; i++) {
            const ticket = new Ticket({
                booking: newBooking._id,  // Linking the ticket to the booking
                seatNumber: seatNumber + i,  // Incrementing seat number for each ticket
                passengerName,
                price: totalFare / seatsBooked  // Assuming equal price for each ticket
            });

            // Save the ticket to the database
            await ticket.save();
            tickets.push(ticket);
        }

        if (!mongoose.Types.ObjectId.isValid(routeId) || !mongoose.Types.ObjectId.isValid(scheduleId)) {
            return res.status(400).json({ message: "Invalid route or schedule ID format" });
        }
        console.log("Route ID:", routeId);
console.log("Schedule ID:", scheduleId);


res.status(201).json({
    message: 'Ticket booked successfully',
    booking: newBooking,
});
    } catch (error) {
        console.error("Error booking ticket:", error.message);
        console.log("Booking Data:", newBooking); // Will log `undefined` if `newBooking` was not created.
        res.status(500).json({ message: 'Server error' });
    }
};


const downloadTicket = async (req, res) => {
  try {
      const bookingId = req.query.bookingId;

      if (!mongoose.Types.ObjectId.isValid(bookingId)) {
          return res.status(400).json({ message: 'Invalid booking ID format' });
      }

      const booking = await Booking.findById(bookingId).populate('route schedule');

      if (!booking) {
          return res.status(404).json({ message: 'Booking not found' });
      }

      const ticketData = {
          customerName: booking.customerName,
          customerEmail: booking.customerEmail,
          route: booking.route.name,
          schedule: booking.schedule.time,
          seatsBooked: booking.seatsBooked,
          totalFare: booking.totalFare,
          paymentStatus: booking.paymentStatus,
          paymentDate: booking.paymentDate ? booking.paymentDate.toISOString() : 'N/A',
      };

      const filePath = generateTicketPDF(ticketData);

      // Send the file to the client
      res.download(filePath, (err) => {
          if (err) {
              console.error("Error sending file:", err);
              res.status(500).json({ message: 'Error downloading file' });
          } else {
              // Optionally delete the file after sending
              fs.unlinkSync(filePath);
          }
          
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};

export { downloadTicket };
