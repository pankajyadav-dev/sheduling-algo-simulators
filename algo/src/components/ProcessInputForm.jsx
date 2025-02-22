import React, { useState } from 'react';

function ProcessInputForm({ processes, setProcesses, timeQuantum, setTimeQuantum, algorithmstate }) {
  const [process, setProcess] = useState({ id: '', arrivalTime: 0, burstTime: 0, priority: 0 ,queueId:0});


  const handleAddProcess = () => {
    setProcesses([...processes, { ...process, id: `P${processes.length + 1}` }]);
    setProcess({ id: '', arrivalTime: 0, burstTime: 0, priority: 0 ,queueId:0});
  };

  return (
    <div className="ml-8 mb-8 flex flex-col flex-wrap">
      <h2 className="text-xl font-semibold mb-4">Add Processes</h2>
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
          Add Process
        </button>
      </div>
      <h1 className='text-xl font-semibold mb-4'>process in queue</h1>
      <div className='border-2 border-blue-900 rounded-lg p-4 w-fit'>
        <div className='flex gap-4 border-b-2 border-blue-900 pb-2'>
          <div className='w-35'>Process</div>
          <div className='w-35'>Arrival Time</div>
          <div className='w-35'>Burst Time</div>
          <div className='w-35'>Priority</div>
          {algorithmstate && (
        <>
          <div className='w-35'>Queue ID</div>
        </>
      )}

      </div>
        {processes.map((process) => (
          <div className='flex gap-4' key={process.id}>
            <div className='w-35'>{process.id}</div>
            <div className='w-35'>{process.arrivalTime}</div>
            <div className='w-35'>{process.burstTime}</div>
            <div className='w-35'>{process.priority}</div>
            {algorithmstate && (
        <>
            <div className='w-35'>{process.queueId}</div>
        </>
      )}
      </div>
    ))}
      </div>

    </div>
  );
}

export default ProcessInputForm;