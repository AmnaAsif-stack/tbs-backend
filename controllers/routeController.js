import Route from '../models/routes.js';
import Bus from '../models/bus.js'; // Correct the import to use 'Bus' instead of 'bus'

// Function to get all routes or filter based on query parameters
export const getRoutes = async (req, res, next) => {
  try {
    const { start, end, stop } = req.query;
    const filter = {};
    if (start) filter.start = new RegExp(start, 'i');
    if (end) filter.end = new RegExp(end, 'i');
    if (stop) filter.stops = { $in: [new RegExp(stop, 'i')] };

    const routes = await Route.find(filter);
    res.json(routes);
  } catch (error) {
    next(error);
  }
};

export const addRoute = async (req, res, next) => {
  try {
    // Destructure the route details from the request body
    const { start, end, stops, distance, estimatedTime } = req.body;

    // Create a new Route document
    const newRoute = new Route({
      start,
      end,
      stops,
      distance,
      estimatedDuration: estimatedTime // Map the 'estimatedTime' to 'estimatedDuration'
    });

    // Save the route to the database
    const savedRoute = await newRoute.save();

    // Return a response with the saved route
    res.status(201).json(savedRoute);
  } catch (error) {
    next(error);  // Pass any error to the error-handling middleware
  }
};
export const assignBusToRoute = async (req, res) => {
  const { busId, routeId } = req.body;

  try {
    // Check if both the bus and route exist
    const bus = await Bus.findById(busId);
    const route = await Route.findById(routeId);

    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    // Assign the route to the bus
    bus.assignedRoute = routeId;
    await bus.save();

    // Add the bus to the route's buses array
    route.buses.push(busId);
    await route.save();

    res.status(200).json({ message: 'Bus successfully assigned to route' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error assigning bus to route' });
  }
};