// controllers/driverController.js

import Driver from '../models/driver.js'; // Import the Driver model
import Bus from '../models/bus.js'; // Import the Bus model

// Function to add a new driver
export const addDriver = async (req, res) => {
  const { name, contactNumber, licenseNumber, experienceYears, status } = req.body;

  try {
    // Create a new driver document
    const newDriver = new Driver({
      name,
      contactNumber,
      licenseNumber,
      experienceYears,
      status
    });

    // Save the driver to the database
    const savedDriver = await newDriver.save();
    res.status(201).json(savedDriver);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding driver' });
  }
};

// Function to assign a driver to a bus
export const assignDriverToBus = async (req, res) => {
  const { driverId, busId } = req.body;

  try {
    // Find the driver and bus by their IDs
    const driver = await Driver.findById(driverId);
    const bus = await Bus.findById(busId);

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    // Assign the bus to the driver
    driver.assignedBus = busId;
    await driver.save();

    // Assign the driver to the bus
    bus.driver = driverId;
    await bus.save();

    res.status(200).json({ message: 'Driver successfully assigned to bus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error assigning driver to bus' });
  }
};
