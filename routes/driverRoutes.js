// routes/driverRoutes.js

import express from 'express';
import { addDriver, assignDriverToBus } from '../controllers/driverController.js';

const router = express.Router();

// POST route to add a new driver
router.post('/addDriver', addDriver);

// POST route to assign a driver to a bus
router.post('/assignDriverToBus', assignDriverToBus);

export default router;
