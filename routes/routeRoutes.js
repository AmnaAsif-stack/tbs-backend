// routes/routeRoutes.js
import express from 'express';
import { getRoutes,addRoute } from '../controllers/routeController.js';
import {assignBusToRoute} from '../controllers/routeController.js'
import { addBus } from '../controllers/busController.js';
const router = express.Router();

// Define the route for fetching routes
router.get('/', getRoutes);
router.post('/', addRoute);
router.post('/assignBusToRoute', assignBusToRoute);
router.post('/addBus',addBus);
export default router;
