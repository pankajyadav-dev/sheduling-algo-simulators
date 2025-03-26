import express from 'express';
import { calculateScheduling } from '../utils/schedulingAlgorithms.js';
import { calculatebestSchedulingalgo } from '../utils/bestshedulingalgorithm.js';

const router = express.Router();

router.post('/calculate', (req, res) => {
  try {
    const { processes, algorithm, timeQuantum } = req.body;
    
    if (!processes || !Array.isArray(processes) || processes.length === 0) {
      return res.status(400).json({ message: 'Processes array is required and must not be empty' });
    }
    
    if (!algorithm) {
      return res.status(400).json({ message: 'Algorithm is required' });
    }
    
    const result = calculateScheduling(processes, algorithm, timeQuantum || 1);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/best', (req, res) => {
  try {
    const { processes, timeQuantum, weights } = req.body;
    
    if (!processes || !Array.isArray(processes) || processes.length === 0) {
      return res.status(400).json({ message: 'Processes array is required and must not be empty' });
    }
    
    if (!weights) {
      return res.status(400).json({ message: 'Weights are required' });
    }
    
    const bestAlgorithm = calculatebestSchedulingalgo(processes, timeQuantum || 1, weights);
    return res.status(200).json({ bestAlgorithm });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router; 