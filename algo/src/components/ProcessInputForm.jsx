import React, { useState } from 'react';
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

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
    setProcesses([]);  // Clears the processes array
    setNextProcessId(1);  // Resets the process ID counter
    setProcess({ id: '', arrivalTime: 0, burstTime: 0, priority: 0, queueId: 0 });  // Resets input fields
    setEditMode(false);  // Exits edit mode if active
    setEditId(null);  // Clears edit ID
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
    <div className="ml-8 mb-8 flex flex-col flex-wrap">
      <h2 className="text-xl font-semibold mb-4">{editMode ? 'Edit Process' : 'Add Processes'}</h2>
      <div className="flex gap-4">
        <label htmlFor="arrivalTime" className='text-white'>Arrival Time</label>
        <input
          type="number"
          placeholder="Arrival Time"
          value={process.arrivalTime}
          onChange={(e) => setProcess({ ...process, arrivalTime: parseInt(e.target.value) })}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="burstTime" className='text-white'>Burst Time</label>
        <input
          type="number"
          placeholder="Burst Time"
          value={process.burstTime}
          onChange={(e) => setProcess({ ...process, burstTime: parseInt(e.target.value) })}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="priority" className='text-white'>Priority</label>
        <input
          type="number"
          placeholder="Priority"
          value={process.priority}
          onChange={(e) => setProcess({ ...process, priority: parseInt(e.target.value) })}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {algorithmstate && (
          <>
            <label htmlFor="queueId" className='text-white'>Queue ID</label>
            <input
              type="number"
              placeholder="Queue ID"
              value={process.queueId}
              onChange={(e) => setProcess({ ...process, queueId: parseInt(e.target.value) })}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </>
        )}
        <button onClick={handleAddProcess} className="bg-green-500 text-white px-4 py-2 rounded">
          {editMode ? 'Update Process' : 'Add Process'}
        </button>

      </div>

      <h1 className='text-xl font-semibold mb-4'>Processes in Queue</h1>
      <div className='border-2 border-blue-900 rounded-lg p-4 w-fit'>
        <div className='flex gap-4 border-b-2 border-blue-900 pb-2'>
          <div className='w-35'>Process</div>
          <div className='w-35'>Arrival Time</div>
          <div className='w-35'>Burst Time</div>
          <div className='w-35'>Priority</div>
          {algorithmstate && <div className='w-35'>Queue ID</div>}
          <div className='w-35'>Actions</div>
        </div>
        {processes.map((proc) => (
          <div className='flex gap-4 items-center' key={proc.id}>
            <div className='w-35'>{proc.id}</div>
            <div className='w-35'>{proc.arrivalTime}</div>
            <div className='w-35'>{proc.burstTime}</div>
            <div className='w-35'>{proc.priority}</div>
            {algorithmstate && <div className='w-35'>{proc.queueId}</div>}
            <button onClick={() => handleEditProcess(proc)}>
              <MdEdit />
            </button>
            <button onClick={() => handleDeleteProcess(proc.id)} >
              <MdDelete />
            </button>
          </div>
        ))}
      </div>
      <button onClick={handleResetQueue} className="bg-red-500 text-white px-4 py-2 rounded mt-4">
         Reset Queue
      </button>
    </div>
  );
}

export default ProcessInputForm;