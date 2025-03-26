import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdDelete, MdEdit, MdArrowBack, MdRefresh, MdHistory } from 'react-icons/md';
import { getSimulations, deleteSimulation, updateSimulationName } from '../utils/api';

function SavedSimulations() {
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const navigate = useNavigate();

  const fetchSimulations = async () => {
    try {
      setLoading(true);
      const data = await getSimulations();
      setSimulations(data);
      setError(null);
    } catch (err) {
      setError('Failed to load simulations. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSimulations();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this simulation?')) {
      try {
        await deleteSimulation(id);
        setSimulations(simulations.filter(sim => sim._id !== id));
      } catch (err) {
        setError('Failed to delete simulation. Please try again.');
        console.error(err);
      }
    }
  };

  const startEditing = (simulation) => {
    setEditingId(simulation._id);
    setEditName(simulation.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
  };

  const saveNewName = async (id) => {
    try {
      await updateSimulationName(id, editName);
      setSimulations(simulations.map(sim => 
        sim._id === id ? { ...sim, name: editName } : sim
      ));
      setEditingId(null);
    } catch (err) {
      setError('Failed to update simulation name. Please try again.');
      console.error(err);
    }
  };

  const loadSimulation = (id) => {
    navigate(`/simulation/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <MdHistory className="text-blue-400 text-2xl mr-2" />
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
            Saved Simulations
          </h2>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-all duration-200"
          >
            <MdArrowBack />
            <span>Back</span>
          </button>
          <button
            onClick={fetchSimulations}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded-lg transition-all duration-200"
          >
            <MdRefresh />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-800/50 rounded-lg p-3 mb-4">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {simulations.length === 0 ? (
        <div className="bg-gray-700/50 rounded-lg p-6 text-center">
          <p className="text-gray-300 mb-2">No saved simulations found</p>
          <p className="text-gray-400 text-sm">Run a simulation and save it to see it here</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50 text-gray-300 text-sm uppercase">
              <tr>
                <th className="px-4 py-3 text-left rounded-tl-lg">Name</th>
                <th className="px-4 py-3 text-left">Algorithm</th>
                <th className="px-4 py-3 text-left">Processes</th>
                <th className="px-4 py-3 text-left">Created</th>
                <th className="px-4 py-3 text-right rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
              {simulations.map((simulation) => (
                <tr key={simulation._id} className="text-gray-300 hover:bg-gray-700/30 transition-colors duration-150">
                  <td className="px-4 py-3">
                    {editingId === simulation._id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="bg-gray-700 text-white border border-gray-600 p-1.5 rounded-lg w-full"
                          autoFocus
                        />
                        <button 
                          onClick={() => saveNewName(simulation._id)}
                          className="p-1.5 bg-green-700/40 hover:bg-green-700/60 rounded-md transition-colors"
                        >
                          Save
                        </button>
                        <button 
                          onClick={cancelEditing}
                          className="p-1.5 bg-red-700/40 hover:bg-red-700/60 rounded-md transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span className="font-medium text-blue-400">{simulation.name}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{simulation.algorithm}</td>
                  <td className="px-4 py-3">{simulation.processes.length}</td>
                  <td className="px-4 py-3">{new Date(simulation.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end space-x-1">
                      <button
                        onClick={() => loadSimulation(simulation._id)}
                        className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 rounded-md transition-colors duration-150"
                        title="Load simulation"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => startEditing(simulation)}
                        className="p-1.5 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/30 rounded-md transition-colors duration-150"
                        title="Edit name"
                      >
                        <MdEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(simulation._id)}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-md transition-colors duration-150"
                        title="Delete simulation"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SavedSimulations; 