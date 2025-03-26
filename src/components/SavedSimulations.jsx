import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdDelete, MdEdit, MdArrowBack, MdRefresh, MdHistory, MdAdd, MdSearch, MdWarningAmber, MdOutlineStorage } from 'react-icons/md';
import { getSimulations, deleteSimulation, updateSimulationName } from '../utils/api';

function SavedSimulations() {
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteStatus, setDeleteStatus] = useState({ id: null, loading: false });
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
        setDeleteStatus({ id, loading: true });
        await deleteSimulation(id);
        setSimulations(simulations.filter(sim => sim._id !== id));
        setDeleteStatus({ id: null, loading: false });
      } catch (err) {
        setError('Failed to delete simulation. Please try again.');
        setDeleteStatus({ id: null, loading: false });
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
  
  const filteredSimulations = searchTerm.trim() === '' 
    ? simulations 
    : simulations.filter(sim => 
        sim.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sim.algorithm.toLowerCase().includes(searchTerm.toLowerCase())
      );

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-blue-400 text-lg">Loading saved simulations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-x-hidden">
      <div className="relative bg-gradient-to-r from-blue-700 to-blue-500 shadow-2xl">
        <div className="container mx-auto px-4 py-8">
          <h1 className="pb-4 text-3xl md:text-4xl lg:text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
            Saved Simulations
          </h1>
          <p className="text-center text-blue-100 mt-2 max-w-2xl mx-auto">
            View and manage your CPU scheduling simulations
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-all duration-200"
          >
            <MdArrowBack className="text-lg" />
            <span>Back to Simulator</span>
          </button>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center">
              <MdOutlineStorage className="text-blue-400 text-2xl mr-2" />
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                Your Simulations
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-1 bg-green-600 hover:bg-green-500 px-3 py-2 rounded-lg transition-all duration-200"
              >
                <MdAdd />
                <span>New Simulation</span>
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
          
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdSearch className="text-gray-400 text-lg" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search simulations by name or algorithm..."
                className="w-full bg-gray-700/70 text-white border border-gray-600 pl-10 p-2.5 rounded-lg 
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                          transition-colors duration-200 shadow-inner"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-800/50 rounded-lg p-4 mb-6 flex items-center gap-3">
              <MdWarningAmber className="text-red-400 text-xl" />
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {simulations.length === 0 ? (
            <div className="bg-gray-700/50 rounded-xl p-8 text-center border border-gray-700/50 shadow-lg">
              <MdHistory className="text-gray-400 text-5xl mx-auto mb-4" />
              <p className="text-gray-300 text-lg mb-2">No saved simulations found</p>
              <p className="text-gray-400 mb-6">Run a simulation and save it to see it here</p>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 px-6 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 text-lg font-medium"
              >
                <MdAdd />
                <span>Create New Simulation</span>
              </button>
            </div>
          ) : filteredSimulations.length === 0 ? (
            <div className="bg-gray-700/50 rounded-xl p-8 text-center border border-gray-700/50 shadow-lg">
              <MdSearch className="text-gray-400 text-5xl mx-auto mb-4" />
              <p className="text-gray-300 text-lg mb-2">No simulations match your search</p>
              <p className="text-gray-400">Try a different search term or clear the search</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-700/50 shadow-lg">
              <table className="w-full">
                <thead className="bg-gray-700/70 text-gray-300 text-sm uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left rounded-tl-lg">Name</th>
                    <th className="px-4 py-3 text-left">Algorithm</th>
                    <th className="px-4 py-3 text-center">Processes</th>
                    <th className="px-4 py-3 text-left hidden md:table-cell">Created</th>
                    <th className="px-4 py-3 text-right rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/30">
                  {filteredSimulations.map((simulation) => (
                    <tr key={simulation._id} className="text-gray-300 hover:bg-gray-700/50 transition-colors duration-150">
                      <td className="px-4 py-4">
                        {editingId === simulation._id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="bg-gray-700 text-white border border-gray-600 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                            />
                            <button 
                              onClick={() => saveNewName(simulation._id)}
                              className="p-1.5 bg-green-700/40 hover:bg-green-700/60 rounded-lg transition-colors"
                            >
                              Save
                            </button>
                            <button 
                              onClick={cancelEditing}
                              className="p-1.5 bg-red-700/40 hover:bg-red-700/60 rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div 
                            className="font-medium text-blue-400 hover:text-blue-300 hover:underline cursor-pointer transition-colors duration-150" 
                            onClick={() => loadSimulation(simulation._id)}
                          >
                            {simulation.name}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                          {simulation.algorithm}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex items-center justify-center bg-gray-700 text-gray-300 text-sm py-1 px-2.5 rounded-full min-w-8">
                          {simulation.processes.length}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-400 hidden md:table-cell">
                        {new Date(simulation.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => loadSimulation(simulation._id)}
                            className="p-2 bg-blue-900/30 text-blue-400 hover:text-blue-300 hover:bg-blue-900/50 rounded-lg transition-colors duration-150 transform hover:scale-105"
                            title="View simulation details"
                          >
                            View
                          </button>
                          <button
                            onClick={() => startEditing(simulation)}
                            className="p-2 bg-yellow-900/30 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/50 rounded-lg transition-colors duration-150 transform hover:scale-105"
                            title="Edit name"
                          >
                            <MdEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(simulation._id)}
                            disabled={deleteStatus.id === simulation._id && deleteStatus.loading}
                            className="p-2 bg-red-900/30 text-red-400 hover:text-red-300 hover:bg-red-900/50 rounded-lg transition-colors duration-150 disabled:opacity-50 transform hover:scale-105"
                            title="Delete simulation"
                          >
                            {deleteStatus.id === simulation._id && deleteStatus.loading ? (
                              <div className="animate-spin h-4 w-4 border-2 border-red-400 rounded-full border-t-transparent"></div>
                            ) : (
                              <MdDelete />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {filteredSimulations.length > 0 && (
            <div className="mt-4 text-gray-400 text-sm">
              Showing {filteredSimulations.length} of {simulations.length} simulations
            </div>
          )}
        </div>
      </div>
      
      <footer className="mt-12 py-6 bg-gray-900/80 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p></p>
        </div>
      </footer>
    </div>
  );
}

export default SavedSimulations; 