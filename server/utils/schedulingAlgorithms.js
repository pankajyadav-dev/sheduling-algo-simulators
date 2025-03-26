export const calculateScheduling = (processes, algorithm, timeQuantum = 2) => {
  const validProcesses = processes.filter(process => process.burstTime > 0);

  if (validProcesses.length === 0) {
    throw new Error('No valid processes to schedule');
  }
  switch (algorithm) {
    case 'FCFS':
      return firstComeFirstServed(validProcesses);
    case 'Priority':
      return priorityScheduling(validProcesses);
    case 'MultilevelQueue':
      return multilevelQueueScheduling(validProcesses, timeQuantum);
    case 'SJF':
      return shortestJobFirst(validProcesses);
    case 'RoundRobin':
      return roundRobin(validProcesses, timeQuantum);
    case 'SRTF':
      return shortestRemainingTimeFirst(validProcesses);
    case 'HRRN':
      return highestResponseRatioNext(validProcesses);
    case 'LJF':
      return longestJobFirst(validProcesses);
    case 'LRTF':
      return longestRemainingTimeFirst(validProcesses);
    case 'SJN':
      return shortestJobNext(validProcesses);
    default:
      throw new Error('Invalid scheduling algorithm');
  }
};

const firstComeFirstServed = (processes) => {
  let schedule = [];
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalResponseTime = 0;
  processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
  processes.forEach((process) => {
    const waitingTime = Math.max(0, currentTime - process.arrivalTime);
    const responseTime = waitingTime;
    const turnaroundTime = waitingTime + process.burstTime;
    schedule.push({
      process: process.id,
      start: currentTime,
      end: currentTime + process.burstTime,
    });
    currentTime += process.burstTime;
    totalWaitingTime += waitingTime;
    totalTurnaroundTime += turnaroundTime;
    totalResponseTime += responseTime;
  });
  const avgWaitingTime = totalWaitingTime / processes.length;
  const avgTurnaroundTime = totalTurnaroundTime / processes.length;
  const avgResponseTime = totalResponseTime / processes.length;
  const totalBurstTime = schedule[schedule.length - 1].end;
  const throughput = processes.length / totalBurstTime;

  return { schedule, avgWaitingTime, avgTurnaroundTime, avgResponseTime, throughput };
};

const priorityScheduling = (processes) => {
  let schedule = [];
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalResponseTime = 0;
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
    const responseTime = waitingTime;
    const turnaroundTime = waitingTime + nextProcess.burstTime;

    schedule.push({
      process: nextProcess.id,
      start: currentTime,
      end: currentTime + nextProcess.burstTime,
    });

    currentTime += nextProcess.burstTime;
    totalWaitingTime += waitingTime;
    totalTurnaroundTime += turnaroundTime;
    totalResponseTime += responseTime;

    remainingProcesses = remainingProcesses.filter(
      (process) => process.id !== nextProcess.id
    );
  }

  const avgWaitingTime = totalWaitingTime / processes.length;
  const avgTurnaroundTime = totalTurnaroundTime / processes.length;
  const avgResponseTime = totalResponseTime / processes.length;
  const throughput = processes.length / currentTime;

  return { schedule, avgWaitingTime, avgTurnaroundTime, avgResponseTime, throughput };
};

const multilevelQueueScheduling = (processes, timeQuantum) => {
  let schedule = [];
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalResponseTime = 0;
  const queues = {};

  processes.forEach((process) => {
    if (!queues[process.queueId]) {
      queues[process.queueId] = [];
    }
    queues[process.queueId].push({ ...process, remainingTime: process.burstTime, startTime: null });
  });

  const sortedQueueIds = Object.keys(queues)
    .map(Number)
    .sort((a, b) => a - b);

  let currentTime = 0;

  while (true) {
    let executed = false;
    let readyQueue = [];

    sortedQueueIds.forEach(queueId => {
      queues[queueId] = queues[queueId].filter(p => p.remainingTime > 0);
      let queueProcesses = queues[queueId].filter(p => p.arrivalTime <= currentTime);
      queueProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime || a.priority - b.priority);
      readyQueue.push(...queueProcesses);
    });

    if (readyQueue.length === 0) {
      let nextProcess = processes
        .filter(p => p.remainingTime > 0)
        .sort((a, b) => a.arrivalTime - b.arrivalTime)[0];
      if (nextProcess) {
        currentTime = nextProcess.arrivalTime;
        continue;
      } else {
        break;
      }
    }

    let process = readyQueue.shift();

    if (process.startTime === null) {
      process.startTime = currentTime;
      totalResponseTime += process.startTime - process.arrivalTime;
    }

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
  const avgResponseTime = totalResponseTime / processes.length;
  const throughput = processes.length / currentTime;

  return { schedule, avgWaitingTime, avgTurnaroundTime, avgResponseTime, throughput };
};

const shortestJobFirst = (processes) => {
  let schedule = [];
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalResponseTime = 0;
  let completedProcesses = 0;
  let remainingProcesses = processes.map(process => ({
    ...process,
    remainingTime: process.burstTime,
    startTime: null,
  }));

  while (completedProcesses < processes.length) {
    const availableProcesses = remainingProcesses.filter(
      process => process.arrivalTime <= currentTime && process.remainingTime > 0
    );

    if (availableProcesses.length === 0) {
      currentTime++;
      continue;
    }

    const shortestJob = availableProcesses.reduce(
      (prev, curr) => (curr.burstTime < prev.burstTime ? curr : prev)
    );

    if (shortestJob.startTime === null) {
      shortestJob.startTime = currentTime;
      totalResponseTime += shortestJob.startTime - shortestJob.arrivalTime;
    }

    schedule.push({
      process: shortestJob.id,
      start: currentTime,
      end: currentTime + shortestJob.burstTime,
    });

    const waitingTime = currentTime - shortestJob.arrivalTime;
    const turnaroundTime = waitingTime + shortestJob.burstTime;

    currentTime += shortestJob.burstTime;
    totalWaitingTime += waitingTime;
    totalTurnaroundTime += turnaroundTime;

    shortestJob.remainingTime = 0;
    completedProcesses++;
  }

  const avgWaitingTime = totalWaitingTime / processes.length;
  const avgTurnaroundTime = totalTurnaroundTime / processes.length;
  const avgResponseTime = totalResponseTime / processes.length;
  const throughput = processes.length / currentTime;

  return { schedule, avgWaitingTime, avgTurnaroundTime, avgResponseTime, throughput };
};

const roundRobin = (processes, timeQuantum) => {
  let schedule = [];
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalResponseTime = 0;
  let completedProcesses = 0;
  let queue = [];
  
  let processesWithRT = processes.map(process => ({
    ...process,
    remainingTime: process.burstTime,
    firstRun: true,
    startTime: null,
    lastRunTime: 0,
  }));

  processesWithRT.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  while (completedProcesses < processes.length) {
    // Add newly arrived processes to the queue
    const newArrivals = processesWithRT.filter(
      p => p.arrivalTime <= currentTime && p.remainingTime > 0 && !queue.includes(p)
    );
    queue.push(...newArrivals);
    
    if (queue.length === 0) {
      currentTime++;
      continue;
    }
    
    // Get the next process from the queue
    const currentProcess = queue.shift();
    
    if (currentProcess.startTime === null) {
      currentProcess.startTime = currentTime;
      totalResponseTime += currentProcess.startTime - currentProcess.arrivalTime;
    }
    
    // Calculate execution time for this quantum
    const executionTime = Math.min(timeQuantum, currentProcess.remainingTime);
    
    // Update the schedule
    schedule.push({
      process: currentProcess.id,
      start: currentTime,
      end: currentTime + executionTime,
    });
    
    // Update times
    currentTime += executionTime;
    currentProcess.remainingTime -= executionTime;
    
    // If process is completed
    if (currentProcess.remainingTime === 0) {
      const turnaroundTime = currentTime - currentProcess.arrivalTime;
      const waitingTime = turnaroundTime - currentProcess.burstTime;
      
      totalTurnaroundTime += turnaroundTime;
      totalWaitingTime += waitingTime;
      completedProcesses++;
    } else {
      // If process still has remaining time, add it back to the queue
      queue.push(currentProcess);
    }
  }
  
  const avgWaitingTime = totalWaitingTime / processes.length;
  const avgTurnaroundTime = totalTurnaroundTime / processes.length;
  const avgResponseTime = totalResponseTime / processes.length;
  const throughput = processes.length / currentTime;
  
  return { schedule, avgWaitingTime, avgTurnaroundTime, avgResponseTime, throughput };
};

const shortestRemainingTimeFirst = (processes) => {
  let schedule = [];
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalResponseTime = 0;
  let completedProcesses = 0;
  let remainingProcesses = processes.map(process => ({
    ...process,
    remainingTime: process.burstTime,
    startTime: null,
    lastRun: null,
  }));

  let prevProcess = null;

  while (completedProcesses < processes.length) {
    const availableProcesses = remainingProcesses.filter(
      process => process.arrivalTime <= currentTime && process.remainingTime > 0
    );

    if (availableProcesses.length === 0) {
      currentTime++;
      continue;
    }

    const shortestRemainingTimeProcess = availableProcesses.reduce(
      (prev, curr) => (curr.remainingTime < prev.remainingTime ? curr : prev)
    );

    if (shortestRemainingTimeProcess.startTime === null) {
      shortestRemainingTimeProcess.startTime = currentTime;
      totalResponseTime += shortestRemainingTimeProcess.startTime - shortestRemainingTimeProcess.arrivalTime;
    }

    if (prevProcess !== shortestRemainingTimeProcess.id) {
      if (prevProcess !== null) {
        const lastScheduleItem = schedule[schedule.length - 1];
        lastScheduleItem.end = currentTime;
      }
      schedule.push({
        process: shortestRemainingTimeProcess.id,
        start: currentTime,
        end: currentTime + 1,
      });
      prevProcess = shortestRemainingTimeProcess.id;
    } else {
      schedule[schedule.length - 1].end = currentTime + 1;
    }

    shortestRemainingTimeProcess.remainingTime--;
    currentTime++;

    if (shortestRemainingTimeProcess.remainingTime === 0) {
      const turnaroundTime = currentTime - shortestRemainingTimeProcess.arrivalTime;
      const waitingTime = turnaroundTime - shortestRemainingTimeProcess.burstTime;
      totalTurnaroundTime += turnaroundTime;
      totalWaitingTime += waitingTime;
      completedProcesses++;
    }
  }

  const avgWaitingTime = totalWaitingTime / processes.length;
  const avgTurnaroundTime = totalTurnaroundTime / processes.length;
  const avgResponseTime = totalResponseTime / processes.length;
  const throughput = processes.length / currentTime;

  return { schedule, avgWaitingTime, avgTurnaroundTime, avgResponseTime, throughput };
};

const highestResponseRatioNext = (processes) => {
  let schedule = [];
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalResponseTime = 0;
  let remainingProcesses = [...processes];

  remainingProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);

  while (remainingProcesses.length > 0) {
    const availableProcesses = remainingProcesses.filter(
      process => process.arrivalTime <= currentTime
    );

    if (availableProcesses.length === 0) {
      currentTime = remainingProcesses[0].arrivalTime;
      continue;
    }

    // Calculate response ratio for each available process
    const processWithRR = availableProcesses.map(process => {
      const waitingTime = currentTime - process.arrivalTime;
      const responseRatio = (waitingTime + process.burstTime) / process.burstTime;
      return { ...process, responseRatio };
    });

    // Select process with highest response ratio
    const selectedProcess = processWithRR.reduce(
      (prev, curr) => (curr.responseRatio > prev.responseRatio ? curr : prev)
    );

    const waitingTime = currentTime - selectedProcess.arrivalTime;
    const responseTime = waitingTime;
    const turnaroundTime = waitingTime + selectedProcess.burstTime;

    schedule.push({
      process: selectedProcess.id,
      start: currentTime,
      end: currentTime + selectedProcess.burstTime,
    });

    currentTime += selectedProcess.burstTime;
    totalWaitingTime += waitingTime;
    totalTurnaroundTime += turnaroundTime;
    totalResponseTime += responseTime;

    remainingProcesses = remainingProcesses.filter(
      process => process.id !== selectedProcess.id
    );
  }

  const avgWaitingTime = totalWaitingTime / processes.length;
  const avgTurnaroundTime = totalTurnaroundTime / processes.length;
  const avgResponseTime = totalResponseTime / processes.length;
  const throughput = processes.length / currentTime;

  return { schedule, avgWaitingTime, avgTurnaroundTime, avgResponseTime, throughput };
};

const longestJobFirst = (processes) => {
  let schedule = [];
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalResponseTime = 0;
  let completedProcesses = 0;
  let remainingProcesses = processes.map(process => ({
    ...process,
    remainingTime: process.burstTime,
    startTime: null,
  }));

  while (completedProcesses < processes.length) {
    const availableProcesses = remainingProcesses.filter(
      process => process.arrivalTime <= currentTime && process.remainingTime > 0
    );

    if (availableProcesses.length === 0) {
      currentTime++;
      continue;
    }

    const longestJob = availableProcesses.reduce(
      (prev, curr) => (curr.burstTime > prev.burstTime ? curr : prev)
    );

    if (longestJob.startTime === null) {
      longestJob.startTime = currentTime;
      totalResponseTime += longestJob.startTime - longestJob.arrivalTime;
    }

    schedule.push({
      process: longestJob.id,
      start: currentTime,
      end: currentTime + longestJob.burstTime,
    });

    const waitingTime = currentTime - longestJob.arrivalTime;
    const turnaroundTime = waitingTime + longestJob.burstTime;

    currentTime += longestJob.burstTime;
    totalWaitingTime += waitingTime;
    totalTurnaroundTime += turnaroundTime;

    longestJob.remainingTime = 0;
    completedProcesses++;
  }

  const avgWaitingTime = totalWaitingTime / processes.length;
  const avgTurnaroundTime = totalTurnaroundTime / processes.length;
  const avgResponseTime = totalResponseTime / processes.length;
  const throughput = processes.length / currentTime;

  return { schedule, avgWaitingTime, avgTurnaroundTime, avgResponseTime, throughput };
};

const longestRemainingTimeFirst = (processes) => {
  let schedule = [];
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalResponseTime = 0;
  let completedProcesses = 0;
  let remainingProcesses = processes.map(process => ({
    ...process,
    remainingTime: process.burstTime,
    startTime: null,
    lastRun: null,
  }));

  let prevProcess = null;

  while (completedProcesses < processes.length) {
    const availableProcesses = remainingProcesses.filter(
      process => process.arrivalTime <= currentTime && process.remainingTime > 0
    );

    if (availableProcesses.length === 0) {
      currentTime++;
      continue;
    }

    const longestRemainingTimeProcess = availableProcesses.reduce(
      (prev, curr) => (curr.remainingTime > prev.remainingTime ? curr : prev)
    );

    if (longestRemainingTimeProcess.startTime === null) {
      longestRemainingTimeProcess.startTime = currentTime;
      totalResponseTime += longestRemainingTimeProcess.startTime - longestRemainingTimeProcess.arrivalTime;
    }

    if (prevProcess !== longestRemainingTimeProcess.id) {
      if (prevProcess !== null) {
        const lastScheduleItem = schedule[schedule.length - 1];
        lastScheduleItem.end = currentTime;
      }
      schedule.push({
        process: longestRemainingTimeProcess.id,
        start: currentTime,
        end: currentTime + 1,
      });
      prevProcess = longestRemainingTimeProcess.id;
    } else {
      schedule[schedule.length - 1].end = currentTime + 1;
    }

    longestRemainingTimeProcess.remainingTime--;
    currentTime++;

    if (longestRemainingTimeProcess.remainingTime === 0) {
      const turnaroundTime = currentTime - longestRemainingTimeProcess.arrivalTime;
      const waitingTime = turnaroundTime - longestRemainingTimeProcess.burstTime;
      totalTurnaroundTime += turnaroundTime;
      totalWaitingTime += waitingTime;
      completedProcesses++;
    }
  }

  const avgWaitingTime = totalWaitingTime / processes.length;
  const avgTurnaroundTime = totalTurnaroundTime / processes.length;
  const avgResponseTime = totalResponseTime / processes.length;
  const throughput = processes.length / currentTime;

  return { schedule, avgWaitingTime, avgTurnaroundTime, avgResponseTime, throughput };
};

const shortestJobNext = (processes) => {
  return shortestJobFirst(processes);
}; 