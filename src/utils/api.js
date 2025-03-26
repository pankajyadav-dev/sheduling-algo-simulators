import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Algorithm calculations
export const calculateScheduling = async (processes, algorithm, timeQuantum) => {
  try {
    const response = await api.post('/algorithms/calculate', {
      processes,
      algorithm,
      timeQuantum
    });
    return response.data;
  } catch (error) {
    console.error('Error calculating scheduling:', error);
    throw error;
  }
};

export const calculateBestAlgorithm = async (processes, timeQuantum, weights) => {
  try {
    const response = await api.post('/algorithms/best', {
      processes,
      timeQuantum,
      weights
    });
    return response.data.bestAlgorithm;
  } catch (error) {
    console.error('Error calculating best algorithm:', error);
    throw error;
  }
};

// Simulation management
export const saveSimulation = async (data) => {
  try {
    const response = await api.post('/simulations', data);
    return response.data;
  } catch (error) {
    console.error('Error saving simulation:', error);
    throw error;
  }
};

export const getSimulations = async () => {
  try {
    const response = await api.get('/simulations');
    return response.data;
  } catch (error) {
    console.error('Error fetching simulations:', error);
    throw error;
  }
};

export const getSimulationById = async (id) => {
  try {
    const response = await api.get(`/simulations/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching simulation:', error);
    throw error;
  }
};

export const updateSimulationName = async (id, name) => {
  try {
    const response = await api.put(`/simulations/${id}`, { name });
    return response.data;
  } catch (error) {
    console.error('Error updating simulation name:', error);
    throw error;
  }
};

export const deleteSimulation = async (id) => {
  try {
    const response = await api.delete(`/simulations/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting simulation:', error);
    throw error;
  }
}; 