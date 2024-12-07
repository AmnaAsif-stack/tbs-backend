import BusSchedule from '../models/schedule.js';

// Function to add a new bus schedule
export const addBusSchedule = async (req, res) => {
    const { routeId, busId, departureTime, arrivalTime, status } = req.body;

    try {
        // Create a new schedule using the BusSchedule model
        const newSchedule = new BusSchedule({
            route: routeId,
            bus: busId,
            departureTime,
            arrivalTime,
            status,
        });

        await newSchedule.save();
        res.status(201).json({ message: 'Bus schedule added successfully', schedule: newSchedule });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding bus schedule' });
    }
};


export const getBusSchedulesByRoute = async (req, res) => {
  const { routeId } = req.params;
  console.log("Route ID received by backend:", routeId); // Check the received route ID

  try {
      const schedules = await BusSchedule.find({ route: routeId })
          .populate('bus')
          .populate('route')
          .exec();
      
      console.log("Fetched schedules:", schedules); // Log schedules to inspect the data

      if (!schedules || schedules.length === 0) {
          return res.status(404).json({ message: 'No bus schedules found for this route' });
      }

      res.status(200).json(schedules);
  } catch (error) {
      console.error("Error fetching bus schedules:", error);
      res.status(500).json({ message: 'Error fetching bus schedules' });
  }
};
