
export const calculateScheduling = (processes, algorithm, timeQuantum = 2) => {
  switch (algorithm) {
    case 'FCFS':
      return firstComeFirstServed(processes);
    case 'Priority':
      return priorityScheduling(processes);
    case 'MultilevelQueue':
      return multilevelQueueScheduling(processes, timeQuantum);
    case 'SJF':
      return shortestJobFirst(processes);
    case 'RoundRobin':
      return roundRobin(processes, timeQuantum);
    case 'SRTF':
      return shortestRemainingTimeFirst(processes);
    case 'HRRN':
      return highestResponseRatioNext(processes);
    case 'LJF':
      return longestJobFirst(processes);
    case 'LRTF':
      return longestRemainingTimeFirst(processes);
    case 'SJN':
      return shortestJobNext(processes);
    default:
      throw new Error('Invalid scheduling algorithm');
  }
};


const firstComeFirstServed = (processes) => {
  let schedule = [];
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;

  processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
  processes.forEach((process) => {
    const waitingTime = Math.max(0, currentTime - process.arrivalTime);
    const turnaroundTime = waitingTime + process.burstTime;
    schedule.push({
      process: process.id,
      start: currentTime,
      end: currentTime + process.burstTime,
    });
    currentTime += process.burstTime;
    totalWaitingTime += waitingTime;
    totalTurnaroundTime += turnaroundTime;
  });
  const avgWaitingTime = totalWaitingTime / processes.length;
  const avgTurnaroundTime = totalTurnaroundTime / processes.length;
  return { schedule, avgWaitingTime, avgTurnaroundTime };
};






const priorityScheduling = (processes) => {
  let schedule = [];
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let remainingProcesses = [...processes];
  while (remainingProcesses.length > 0) {
    const availableProcesses = remainingProcesses.filter(
      (process) => process.arrivalTime <= currentTime
    );
    if (availableProcesses.length === 0) {
      currentTime++;
      continue;
    }
    const nextProcess = availableProcesses.reduce((prev, curr) =>
      curr.priority < prev.priority ? curr : prev
    );
    const waitingTime = currentTime - nextProcess.arrivalTime;
    const turnaroundTime = waitingTime + nextProcess.burstTime;
    schedule.push({
      process: nextProcess.id,
      start: currentTime,
      end: currentTime + nextProcess.burstTime,
    });
    currentTime += nextProcess.burstTime;
    totalWaitingTime += waitingTime;
    totalTurnaroundTime += turnaroundTime;
    remainingProcesses = remainingProcesses.filter(
      (process) => process.id !== nextProcess.id
    );
  }
  const avgWaitingTime = totalWaitingTime / processes.length;
  const avgTurnaroundTime = totalTurnaroundTime / processes.length;
  return { schedule, avgWaitingTime, avgTurnaroundTime };
};












const multilevelQueueScheduling = (processes, timeQuantum) => {
  let schedule = [];
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  const queues = {};
  processes.forEach((process) => {
    if (!queues[process.queueId]) {
      queues[process.queueId] = [];
    }
    queues[process.queueId].push({ ...process, remainingTime: process.burstTime });
  });
  const sortedQueueIds = Object.keys(queues)
    .map(Number)
    .sort((a, b) => a - b);
  let currentTime = 0;
  while (true) {
    let executed = false;
    let readyQueue = [];
    sortedQueueIds.forEach(queueId => {
      queues[queueId] = queues[queueId].filter(p => p.remainingTime > 0); // Remove completed processes
      let queueProcesses = queues[queueId].filter(p => p.arrivalTime <= currentTime);
      queueProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime || a.priority - b.priority);
      readyQueue.push(...queueProcesses);
    });
    if (readyQueue.length === 0) {
      let nextProcess = processes.filter(p => p.remainingTime > 0).sort((a, b) => a.arrivalTime - b.arrivalTime)[0];
      if (nextProcess) {
        currentTime = nextProcess.arrivalTime;
        continue;
      } else {
        break; 
      }
    }
    let process = readyQueue.shift();
    let executeTime = Math.min(timeQuantum, process.remainingTime);
    schedule.push({ process: process.id, start: currentTime, end: currentTime + executeTime });
    currentTime += executeTime;
    process.remainingTime -= executeTime;
    executed = true;
    if (process.remainingTime === 0) {
      let turnaroundTime = currentTime - process.arrivalTime;
      let waitingTime = turnaroundTime - process.burstTime;
      totalTurnaroundTime += turnaroundTime;
      totalWaitingTime += waitingTime;
    }
  }
  const avgWaitingTime = totalWaitingTime / processes.length;
  const avgTurnaroundTime = totalTurnaroundTime / processes.length;
  return { schedule, avgWaitingTime, avgTurnaroundTime };
};










const shortestJobFirst = (processes) => {
  let schedule = [];
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let remainingProcesses = [...processes];
  while (remainingProcesses.length > 0) {
    const availableProcesses = remainingProcesses.filter(
      (process) => process.arrivalTime <= currentTime
    );
    if (availableProcesses.length === 0) {
      currentTime++;
      continue;
    }
    const nextProcess = availableProcesses.reduce((prev, curr) =>
      curr.burstTime < prev.burstTime ? curr : prev
    );
    const waitingTime = currentTime - nextProcess.arrivalTime;
    const turnaroundTime = waitingTime + nextProcess.burstTime;
    schedule.push({
      process: nextProcess.id,
      start: currentTime,
      end: currentTime + nextProcess.burstTime,
    });
    currentTime += nextProcess.burstTime;
    totalWaitingTime += waitingTime;
    totalTurnaroundTime += turnaroundTime;
    remainingProcesses = remainingProcesses.filter(
      (process) => process.id !== nextProcess.id
    );
  }
  const avgWaitingTime = totalWaitingTime / processes.length;
  const avgTurnaroundTime = totalTurnaroundTime / processes.length;
  return { schedule, avgWaitingTime, avgTurnaroundTime };
};


















const roundRobin = (processes, timeQuantum) => {
  let schedule = [];
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let remainingProcesses = processes.map((process) => ({
    ...process,
    remainingTime: process.burstTime,
  }));
  while (remainingProcesses.some((process) => process.remainingTime > 0)) {
    for (let i = 0; i < remainingProcesses.length; i++) {
      const process = remainingProcesses[i];
      if (process.remainingTime <= 0 || process.arrivalTime > currentTime) {
        continue;
      }
      const executionTime = Math.min(timeQuantum, process.remainingTime);
      schedule.push({
        process: process.id,
        start: currentTime,
        end: currentTime + executionTime,
      });
      currentTime += executionTime;
      process.remainingTime -= executionTime;
      if (process.remainingTime === 0) {
        const waitingTime = currentTime - process.arrivalTime - process.burstTime;
        const turnaroundTime = currentTime - process.arrivalTime;
        totalWaitingTime += waitingTime;
        totalTurnaroundTime += turnaroundTime;
      }
    }
  }
  const avgWaitingTime = totalWaitingTime / processes.length;
  const avgTurnaroundTime = totalTurnaroundTime / processes.length;
  return { schedule, avgWaitingTime, avgTurnaroundTime };
};












const shortestRemainingTimeFirst = (processes) => {
  let schedule = [];
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let remainingProcesses = processes.map((process) => ({
    ...process,
    remainingTime: process.burstTime,
  }));
  while (remainingProcesses.some((process) => process.remainingTime > 0)) {
    const availableProcesses = remainingProcesses.filter(
      (process) => process.arrivalTime <= currentTime && process.remainingTime > 0
    );
    if (availableProcesses.length === 0) {
      currentTime++;
      continue;
    }
    const nextProcess = availableProcesses.reduce((prev, curr) =>
      curr.remainingTime < prev.remainingTime ? curr : prev
    );
    const executionTime = 1; // Execute for 1 unit of time
    schedule.push({
      process: nextProcess.id,
      start: currentTime,
      end: currentTime + executionTime,
    });
    currentTime += executionTime;
    nextProcess.remainingTime -= executionTime;
    if (nextProcess.remainingTime === 0) {
      const waitingTime = currentTime - nextProcess.arrivalTime - nextProcess.burstTime;
      const turnaroundTime = currentTime - nextProcess.arrivalTime;
      totalWaitingTime += waitingTime;
      totalTurnaroundTime += turnaroundTime;
    }
  }
  const avgWaitingTime = totalWaitingTime / processes.length;
  const avgTurnaroundTime = totalTurnaroundTime / processes.length;
  return { schedule, avgWaitingTime, avgTurnaroundTime };
};















const highestResponseRatioNext = (processes) => {
  let schedule = [];
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let remainingProcesses = [...processes];
  while (remainingProcesses.length > 0) {
    const availableProcesses = remainingProcesses.filter(
      (process) => process.arrivalTime <= currentTime
    );
    if (availableProcesses.length === 0) {
      currentTime++;
      continue;
    }
    const nextProcess = availableProcesses.reduce((prev, curr) => {
      const prevRatio = (currentTime - prev.arrivalTime + prev.burstTime) / prev.burstTime;
      const currRatio = (currentTime - curr.arrivalTime + curr.burstTime) / curr.burstTime;
      return currRatio > prevRatio ? curr : prev;
    });
    const waitingTime = currentTime - nextProcess.arrivalTime;
    const turnaroundTime = waitingTime + nextProcess.burstTime;
    schedule.push({
      process: nextProcess.id,
      start: currentTime,
      end: currentTime + nextProcess.burstTime,
    });
    currentTime += nextProcess.burstTime;
    totalWaitingTime += waitingTime;
    totalTurnaroundTime += turnaroundTime;
    remainingProcesses = remainingProcesses.filter(
      (process) => process.id !== nextProcess.id
    );
  }
  const avgWaitingTime = totalWaitingTime / processes.length;
  const avgTurnaroundTime = totalTurnaroundTime / processes.length;
  return { schedule, avgWaitingTime, avgTurnaroundTime };
};












const longestJobFirst = (processes) => {
  let schedule = [];
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let remainingProcesses = [...processes];
  while (remainingProcesses.length > 0) {
    const availableProcesses = remainingProcesses.filter(
      (process) => process.arrivalTime <= currentTime
    );
    if (availableProcesses.length === 0) {
      currentTime++;
      continue;
    }
    const nextProcess = availableProcesses.reduce((prev, curr) =>
      curr.burstTime > prev.burstTime ? curr : prev
    );
    const waitingTime = currentTime - nextProcess.arrivalTime;
    const turnaroundTime = waitingTime + nextProcess.burstTime;
    schedule.push({
      process: nextProcess.id,
      start: currentTime,
      end: currentTime + nextProcess.burstTime,
    });
    currentTime += nextProcess.burstTime;
    totalWaitingTime += waitingTime;
    totalTurnaroundTime += turnaroundTime;
    remainingProcesses = remainingProcesses.filter(
      (process) => process.id !== nextProcess.id
    );
  }
  const avgWaitingTime = totalWaitingTime / processes.length;
  const avgTurnaroundTime = totalTurnaroundTime / processes.length;
  return { schedule, avgWaitingTime, avgTurnaroundTime };
};


















const longestRemainingTimeFirst = (processes) => {
  let schedule = [];
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let remainingProcesses = processes.map((process) => ({
    ...process,
    remainingTime: process.burstTime,
  }));
  while (remainingProcesses.some((process) => process.remainingTime > 0)) {
    const availableProcesses = remainingProcesses.filter(
      (process) => process.arrivalTime <= currentTime && process.remainingTime > 0
    );
    if (availableProcesses.length === 0) {
      currentTime++;
      continue;
    }
    const nextProcess = availableProcesses.reduce((prev, curr) =>
      curr.remainingTime > prev.remainingTime ? curr : prev
    );
    const executionTime = 1; 
    schedule.push({
      process: nextProcess.id,
      start: currentTime,
      end: currentTime + executionTime,
    });
    currentTime += executionTime;
    nextProcess.remainingTime -= executionTime;
    if (nextProcess.remainingTime === 0) {
      const waitingTime = currentTime - nextProcess.arrivalTime - nextProcess.burstTime;
      const turnaroundTime = currentTime - nextProcess.arrivalTime;
      totalWaitingTime += waitingTime;
      totalTurnaroundTime += turnaroundTime;
    }
  }
  const avgWaitingTime = totalWaitingTime / processes.length;
  const avgTurnaroundTime = totalTurnaroundTime / processes.length;
  return { schedule, avgWaitingTime, avgTurnaroundTime };
};








const shortestJobNext = (processes) => {
  return shortestJobFirst(processes); 
};