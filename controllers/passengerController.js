// controllers/passengerController.js
import Passenger from '../models/Passenger.js';
import User from '../models/user.js';

// Add a new passenger
import mongoose from 'mongoose';


export const addPassenger = async (req, res) => {
    try {
        const { passportNumber, phone, address, dateOfBirth } = req.body;
        const userId = req.userId;  // Get the logged-in user's userId from the token

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newPassenger = new Passenger({
            userId,
            passportNumber,
            phone,
            address,
            dateOfBirth
        });

        await newPassenger.save();
        res.status(201).json({ message: 'Passenger added successfully', passenger: newPassenger });
    } catch (error) {
        console.error("Error in addPassenger:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update passenger details
export const updatePassenger = async (req, res) => {
    try {
        const { passengerId, passportNumber, phone, address, dateOfBirth } = req.body;

        const passenger = await Passenger.findById(passengerId);
        if (!passenger) {
            return res.status(404).json({ message: 'Passenger not found' });
        }

        passenger.passportNumber = passportNumber || passenger.passportNumber;
        passenger.phone = phone || passenger.phone;
        passenger.address = address || passenger.address;
        passenger.dateOfBirth = dateOfBirth || passenger.dateOfBirth;

        await passenger.save();
        res.status(200).json({ message: 'Passenger details updated successfully', passenger });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Fetch all passengers
export const getAllPassengers = async (req, res) => {
    try {
        const userId = req.userId;  // Get the logged-in user's userId from the token

        // Fetch passengers associated with the logged-in user
        const passengers = await Passenger.find({ userId }).populate('userId');
        if (!passengers) {
            return res.status(404).json({ message: 'No passengers found for this user' });
        }

        res.status(200).json({ passengers });
    } catch (error) {
        console.error("Error in getAllPassengers:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Fetch a specific passenger by ID
export const getPassengerById = async (req, res) => {
    try {
        const passenger = await Passenger.findById(req.params.id).populate('userId');
        if (!passenger) {
            return res.status(404).json({ message: 'Passenger not found' });
        }
        res.status(200).json({ passenger });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a passenger
export const deletePassenger = async (req, res) => {
    try {
        const passenger = await Passenger.findById(req.params.id);
        if (!passenger) {
            return res.status(404).json({ message: 'Passenger not found' });
        }
        
        await passenger.remove();
        res.status(200).json({ message: 'Passenger deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
