import Simulation from '../models/Simulation.js';

export const createSimulation = async (req, res) => {
  try {
    const { 
      algorithm, 
      timeQuantum, 
      processes, 
      ganttData, 
      metrics, 
      name 
    } = req.body;

    const simulation = new Simulation({
      name: name || `${algorithm} Simulation ${new Date().toLocaleString()}`,
      algorithm,
      timeQuantum,
      processes,
      ganttData,
      metrics
    });

    await simulation.save();
    res.status(201).json(simulation);
  } catch (error) {
    res.status(500).json({ message: 'Error creating simulation', error: error.message });
  }
};
export const getSimulations = async (req, res) => {
  try {
    const simulations = await Simulation.find().sort({ createdAt: -1 });
    res.status(200).json(simulations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching simulations', error: error.message });
  }
};
export const getSimulationById = async (req, res) => {
  try {
    const simulation = await Simulation.findById(req.params.id);
    if (!simulation) {
      return res.status(404).json({ message: 'Simulation not found' });
    }
    res.status(200).json(simulation);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching simulation', error: error.message });
  }
};
export const updateSimulation = async (req, res) => {
  try {
    const { name } = req.body;
    
    const simulation = await Simulation.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    
    if (!simulation) {
      return res.status(404).json({ message: 'Simulation not found' });
    }
    
    res.status(200).json(simulation);
  } catch (error) {
    res.status(500).json({ message: 'Error updating simulation', error: error.message });
  }
};

export const deleteSimulation = async (req, res) => {
  try {
    const simulation = await Simulation.findByIdAndDelete(req.params.id);
    
    if (!simulation) {
      return res.status(404).json({ message: 'Simulation not found' });
    }
    
    res.status(200).json({ message: 'Simulation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting simulation', error: error.message });
  }
}; 