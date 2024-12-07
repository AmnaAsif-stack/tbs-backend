// routes/busRoutes.js

import express from 'express';
import { addBus } from '../controllers/busController.js';

const router = express.Router();

// POST route to add a new bus
router.post('/addBus', addBus);

export default router;
