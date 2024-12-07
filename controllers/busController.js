// controllers/busController.js

import Bus from '../models/bus.js';

// Function to add a new bus
export const addBus = async (req, res) => {
  const { licensePlate, capacity, type, driver, status, assignedRoute, features } = req.body;

  try {
    // Create a new bus document
    const newBus = new Bus({
      licensePlate,
      capacity,
      type,
      driver,
      status,
      assignedRoute,
      features
    });

    // Save the bus to the database
    const savedBus = await newBus.save();
    res.status(201).json(savedBus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding bus' });
  }
};
