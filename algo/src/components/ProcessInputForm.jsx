import React, { useState } from 'react';
import { MdEdit, MdDelete, MdAdd, MdRefresh } from "react-icons/md";

function ProcessInputForm({ processes, setProcesses, timeQuantum, setTimeQuantum, algorithmstate }) {
  const [process, setProcess] = useState({ id: '', arrivalTime: 0, burstTime: 0, priority: 0, queueId: 0 });
  const [nextProcessId, setNextProcessId] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleAddProcess = () => {
    if (editMode) {
      setProcesses(
        processes.map((proc) => (proc.id === editId ? { ...process, id: editId } : proc))
      );
      setEditMode(false);
      setEditId(null);
    } else {
      setProcesses([...processes, { ...process, id: `P${nextProcessId}` }]);
      setNextProcessId(nextProcessId + 1);
    }
    setProcess({ id: '', arrivalTime: 0, burstTime: 0, priority: 0, queueId: 0 });
  };

  const handleResetQueue = () => {
    setProcesses([]);
    setNextProcessId(1);
    setProcess({ id: '', arrivalTime: 0, burstTime: 0, priority: 0, queueId: 0 });
    setEditMode(false);
    setEditId(null);
  };

  const handleEditProcess = (proc) => {
    setProcess(proc);
    setEditMode(true);
    setEditId(proc.id);
  };

  const handleDeleteProcess = (id) => {
    setProcesses(processes.filter((proc) => proc.id !== id));
  };

  return (
    <div className="mx-4 sm:mx-8 mb-8 flex flex-col lg:flex-row gap-8">
      <div className="flex-1 bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-blue-400 mb-6">
          {editMode ? 'Edit Process' : 'Add New Process'}
        </h2>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <label htmlFor="arrivalTime" className="text-gray-300 font-medium w-full sm:w-32">Arrival Time</label>
            <input
              type="number"
              placeholder="Enter arrival time"
              value={process.arrivalTime}
              onChange={(e) => setProcess({ ...process, arrivalTime: parseInt(e.target.value) })}
              className="bg-gray-700 text-white border-2 border-gray-600 p-3 rounded-lg focus:outline-none focus:border-blue-500 w-full sm:flex-1 transition duration-200"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <label htmlFor="burstTime" className="text-gray-300 font-medium w-full sm:w-32">Burst Time</label>
            <input
              type="number"
              placeholder="Enter burst time"
              value={process.burstTime}
              onChange={(e) => setProcess({ ...process, burstTime: parseInt(e.target.value) })}
              className="bg-gray-700 text-white border-2 border-gray-600 p-3 rounded-lg focus:outline-none focus:border-blue-500 w-full sm:flex-1 transition duration-200"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <label htmlFor="priority" className="text-gray-300 font-medium w-full sm:w-32">Priority</label>
            <input
              type="number"
              placeholder="Enter priority"
              value={process.priority}
              onChange={(e) => setProcess({ ...process, priority: parseInt(e.target.value) })}
              className="bg-gray-700 text-white border-2 border-gray-600 p-3 rounded-lg focus:outline-none focus:border-blue-500 w-full sm:flex-1 transition duration-200"
            />
          </div>
          {algorithmstate && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <label htmlFor="queueId" className="text-gray-300 font-medium w-full sm:w-32">Queue ID</label>
              <input
                type="number"
                placeholder="Enter queue ID"
                value={process.queueId}
                onChange={(e) => setProcess({ ...process, queueId: parseInt(e.target.value) })}
                className="bg-gray-700 text-white border-2 border-gray-600 p-3 rounded-lg focus:outline-none focus:border-blue-500 w-full sm:flex-1 transition duration-200"
              />
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button 
              onClick={handleAddProcess} 
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-800 transition duration-300 w-full sm:flex-1"
            >
              <MdAdd size={20} />
              {editMode ? 'Update Process' : 'Add Process'}
            </button>
            <button 
              onClick={handleResetQueue} 
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-red-800 transition duration-300 w-full sm:flex-1"
            >
              <MdRefresh size={20} />
              Reset Queue
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1">
        {processes.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-blue-400 mb-6">Process Queue</h2>
            <div className="overflow-hidden rounded-xl border-2 border-gray-700">
              <div className="bg-gray-700 flex gap-4 p-4 font-medium text-gray-200">
                <div className="flex-1">Process</div>
                <div className="flex-1">Arrival Time</div>
                <div className="flex-1">Burst Time</div>
                <div className="flex-1">Priority</div>
                {algorithmstate && <div className="flex-1">Queue ID</div>}
                <div className="w-24">Actions</div>
              </div>
              <div className="divide-y divide-gray-700">
                {processes.map((proc) => (
                  <div className="flex items-center gap-4 p-4 hover:bg-gray-700/50 transition duration-200" key={proc.id}>
                    <div className="flex-1 text-blue-400 font-medium">{proc.id}</div>
                    <div className="flex-1 text-gray-300">{proc.arrivalTime}</div>
                    <div className="flex-1 text-gray-300">{proc.burstTime}</div>
                    <div className="flex-1 text-gray-300">{proc.priority}</div>
                    {algorithmstate && <div className="flex-1 text-gray-300">{proc.queueId}</div>}
                    <div className="w-24 flex gap-3">
                      <button 
                        onClick={() => handleEditProcess(proc)}
                        className="text-blue-400 hover:text-blue-300 transition duration-200"
                      >
                        <MdEdit size={20} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProcess(proc.id)}
                        className="text-red-400 hover:text-red-300 transition duration-200"
                      >
                        <MdDelete size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProcessInputForm;