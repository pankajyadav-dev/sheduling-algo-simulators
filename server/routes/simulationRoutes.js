import express from 'express';
import {
  createSimulation,
  getSimulations,
  getSimulationById,
  updateSimulation,
  deleteSimulation
} from '../controllers/simulationController.js';

const router = express.Router();

// Create a new simulation
router.post('/', createSimulation);

// Get all simulations
router.get('/', getSimulations);

// Get a single simulation by ID
router.get('/:id', getSimulationById);

// Update a simulation name
router.put('/:id', updateSimulation);

// Delete a simulation
router.delete('/:id', deleteSimulation);

export default router; 