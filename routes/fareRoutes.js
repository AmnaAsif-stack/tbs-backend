import express from 'express';
import { getFare } from '../controllers/fareController.js';

const router = express.Router();

// GET fare details by routeId
router.get('/fare', getFare);

export default router;
