import express from 'express';
import { addBusSchedule, getBusSchedulesByRoute } from '../controllers/busScheduleController.js';

const router = express.Router();

// Route to add a new bus schedule
router.post('/add', addBusSchedule);

router.get('/api/bus-schedules/:routeId', getBusSchedulesByRoute); // Keep this

export default router;
