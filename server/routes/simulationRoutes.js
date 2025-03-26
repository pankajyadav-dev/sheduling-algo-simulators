import express from 'express';
import {
  createSimulation,
  getSimulations,
  getSimulationById,
  updateSimulation,
  deleteSimulation
} from '../controllers/simulationController.js';

const router = express.Router();

router.post('/', createSimulation);

router.get('/', getSimulations);

router.get('/:id', getSimulationById);

router.put('/:id', updateSimulation);

router.delete('/:id', deleteSimulation);

export default router; 