export const calculatebestSchedulingalgo = (processes, timeQuantum = 2, weights = { tat: 0.3, wt: 0.3, rt: 0.2, tp: 0.2 }) => {
  const validProcesses = processes.filter(process => process.burstTime > 0);
  if (validProcesses.length === 0) {
    throw new Error('No valid processes to schedule');
  }
  const results = {
    FirstComeFirstServed: firstComeFirstServed(validProcesses),
    PriorityScheduling: priorityScheduling(validProcesses),
    MultilevelQueueScheduling: multilevelQueueScheduling(validProcesses, timeQuantum),
    ShortestJobFirst: shortestJobFirst(validProcesses),
    RoundRobin: roundRobin(validProcesses, timeQuantum),
    ShortestRemainingTimeFirst: shortestRemainingTimeFirst(validProcesses),
    HighestResponseRatioNext: highestResponseRatioNext(validProcesses),
    LongestJobFirst: longestJobFirst(validProcesses),
    LongestRemainingTimeFirst: longestRemainingTimeFirst(validProcesses),
    ShortestJobNext: shortestJobNext(validProcesses)
  };
  const tatValues = [];
  const wtValues = [];
  const rtValues = [];
  const tpValues = [];
  
  for (const algoResult of Object.values(results)) {
    tatValues.push(algoResult.avgTurnaroundTime);
    wtValues.push(algoResult.avgWaitingTime);
    rtValues.push(algoResult.avgResponseTime);
    tpValues.push(algoResult.throughput);
  }
  const maxTAT = Math.max(...tatValues);
  const maxWT = Math.max(...wtValues);
  const maxRT = Math.max(...rtValues);
  const maxTP = Math.max(...tpValues);
  
  let bestAlgorithm = null;
  let bestScore = Infinity;
  
  for (const [algo, { avgTurnaroundTime, avgWaitingTime, avgResponseTime, throughput }] of Object.entries(results)) {
    const normTAT = avgTurnaroundTime / maxTAT;
    const normWT = avgWaitingTime / maxWT;
    const normRT = avgResponseTime / maxRT;
    const normTP = maxTP / throughput;
    const score = 
      weights.tat * normTAT +
      weights.wt  * normWT +
      weights.rt  * normRT +
      weights.tp  * normTP;
      
    if (score < bestScore) {
      bestScore = score;
      bestAlgorithm = algo;
    }
  }
  console.log(bestAlgorithm);
  return bestAlgorithm;
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


  return { avgWaitingTime, avgTurnaroundTime, avgResponseTime, throughput };
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

  return { avgWaitingTime, avgTurnaroundTime, avgResponseTime, throughput };
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

  return {  avgWaitingTime, avgTurnaroundTime, avgResponseTime, throughput };
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
      (process) => process.arrivalTime <= currentTime && process.remainingTime > 0
    );

    if (availableProcesses.length === 0) {
      currentTime++;
      continue;
    }

    const nextProcess = availableProcesses.reduce((prev, curr) =>
      curr.burstTime < prev.burstTime ? curr : prev
    );

    if (nextProcess.startTime === null) {
      nextProcess.startTime = currentTime;
      const responseTime = nextProcess.startTime - nextProcess.arrivalTime;
      totalResponseTime += responseTime;
    }

    const waitingTime = currentTime - nextProcess.arrivalTime;
    const turnaroundTime = waitingTime + nextProcess.burstTime;

    schedule.push({
      process: nextProcess.id,
      start: currentTime,
      end: currentTime + nextProcess.burstTime,
    });

    currentTime += nextProcess.burstTime;
    nextProcess.remainingTime = 0;
    totalWaitingTime += waitingTime;
    totalTurnaroundTime += turnaroundTime;
    completedProcesses++;
  }

  const avgWaitingTime = totalWaitingTime / processes.length;
  const avgTurnaroundTime = totalTurnaroundTime / processes.length;
  const avgResponseTime = totalResponseTime / processes.length;
  const throughput = processes.length / currentTime;

  return {  avgWaitingTime, avgTurnaroundTime, avgResponseTime, throughput };
};

const roundRobin = (processes, timeQuantum) => {
  let schedule = [];
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalResponseTime = 0;
  let completedProcesses = 0;
  let remainingProcesses = processes.map((process) => ({
    ...process,
    remainingTime: process.burstTime,
    startTime: null,
  }));

  while (completedProcesses < processes.length) {
    let executedInThisCycle = false;

    for (let i = 0; i < remainingProcesses.length; i++) {
      const process = remainingProcesses[i];

      if (process.remainingTime > 0 && process.arrivalTime <= currentTime) {
        if (process.startTime === null) {
          process.startTime = currentTime;
          const responseTime = process.startTime - process.arrivalTime;
          totalResponseTime += responseTime;
        }

        const executionTime = Math.min(timeQuantum, process.remainingTime);
        schedule.push({
          process: process.id,
          start: currentTime,
          end: currentTime + executionTime,
        });

        currentTime += executionTime;
        process.remainingTime -= executionTime;
        executedInThisCycle = true;

        if (process.remainingTime === 0) {
          const turnaroundTime = currentTime - process.arrivalTime;
          const waitingTime = turnaroundTime - process.burstTime;
          totalTurnaroundTime += turnaroundTime;
          totalWaitingTime += waitingTime;
          completedProcesses++;
        }
      }
    }

    if (!executedInThisCycle) {
      currentTime++;
    }
  }

  const avgWaitingTime = totalWaitingTime / processes.length;
  const avgTurnaroundTime = totalTurnaroundTime / processes.length;
  const avgResponseTime = totalResponseTime / processes.length;
  const throughput = processes.length / currentTime;

  return {  avgWaitingTime, avgTurnaroundTime, avgResponseTime, throughput };
};


const shortestRemainingTimeFirst = (processes) => {
  let schedule = [];
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalResponseTime = 0;
  let completedProcesses = 0;
  let remainingProcesses = processes.map((process) => ({
    ...process,
    remainingTime: process.burstTime,
    startTime: null,
  }));

  while (completedProcesses < processes.length) {
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

    if (nextProcess.startTime === null) {
      nextProcess.startTime = currentTime;
      const responseTime = nextProcess.startTime - nextProcess.arrivalTime;
      totalResponseTime += responseTime;
    }

    const executionTime = 1; 
    schedule.push({
      process: nextProcess.id,
      start: currentTime,
      end: currentTime + executionTime,
    });

    currentTime += executionTime;
    nextProcess.remainingTime -= executionTime;

    if (nextProcess.remainingTime === 0) {
      const turnaroundTime = currentTime - nextProcess.arrivalTime;
      const waitingTime = turnaroundTime - nextProcess.burstTime;
      totalTurnaroundTime += turnaroundTime;
      totalWaitingTime += waitingTime;
      completedProcesses++;
    }
  }

  const avgWaitingTime = totalWaitingTime / processes.length;
  const avgTurnaroundTime = totalTurnaroundTime / processes.length;
  const avgResponseTime = totalResponseTime / processes.length;
  const throughput = processes.length / currentTime;

  return {  avgWaitingTime, avgTurnaroundTime, avgResponseTime, throughput };
};


const highestResponseRatioNext = (processes) => {
  let schedule = [];
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalResponseTime = 0;
  let completedProcesses = 0;
  let remainingProcesses = processes.map((process) => ({
    ...process,
    startTime: null,
  }));

  while (completedProcesses < processes.length) {
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

    if (nextProcess.startTime === null) {
      nextProcess.startTime = currentTime;
      const responseTime = nextProcess.startTime - nextProcess.arrivalTime;
      totalResponseTime += responseTime;
    }

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
    completedProcesses++;

    remainingProcesses = remainingProcesses.filter(
      (process) => process.id !== nextProcess.id
    );
  }

  const avgWaitingTime = totalWaitingTime / processes.length;
  const avgTurnaroundTime = totalTurnaroundTime / processes.length;
  const avgResponseTime = totalResponseTime / processes.length;
  const throughput = processes.length / currentTime;

  return {  avgWaitingTime, avgTurnaroundTime, avgResponseTime, throughput };
};


const longestJobFirst = (processes) => {
  let schedule = [];
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalResponseTime = 0;
  let completedProcesses = 0;
  let remainingProcesses = processes.map((process) => ({
    ...process,
    startTime: null,
  }));

  while (completedProcesses < processes.length) {
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

    if (nextProcess.startTime === null) {
      nextProcess.startTime = currentTime;
      const responseTime = nextProcess.startTime - nextProcess.arrivalTime;
      totalResponseTime += responseTime;
    }

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
    completedProcesses++;

    remainingProcesses = remainingProcesses.filter(
      (process) => process.id !== nextProcess.id
    );
  }

  const avgWaitingTime = totalWaitingTime / processes.length;
  const avgTurnaroundTime = totalTurnaroundTime / processes.length;
  const avgResponseTime = totalResponseTime / processes.length;
  const throughput = processes.length / currentTime;

  return {  avgWaitingTime, avgTurnaroundTime, avgResponseTime, throughput };
};


const longestRemainingTimeFirst = (processes) => {
  let schedule = [];
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalResponseTime = 0;
  let completedProcesses = 0;
  let remainingProcesses = processes.map((process) => ({
    ...process,
    remainingTime: process.burstTime,
    startTime: null,
  }));

  while (completedProcesses < processes.length) {
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

    if (nextProcess.startTime === null) {
      nextProcess.startTime = currentTime;
      const responseTime = nextProcess.startTime - nextProcess.arrivalTime;
      totalResponseTime += responseTime;
    }

    const executionTime = 1;
    schedule.push({
      process: nextProcess.id,
      start: currentTime,
      end: currentTime + executionTime,
    });

    currentTime += executionTime;
    nextProcess.remainingTime -= executionTime;

    if (nextProcess.remainingTime === 0) {
      const turnaroundTime = currentTime - nextProcess.arrivalTime;
      const waitingTime = turnaroundTime - nextProcess.burstTime;
      totalTurnaroundTime += turnaroundTime;
      totalWaitingTime += waitingTime;
      completedProcesses++;
    }
  }

  const avgWaitingTime = totalWaitingTime / processes.length;
  const avgTurnaroundTime = totalTurnaroundTime / processes.length;
  const avgResponseTime = totalResponseTime / processes.length;
  const throughput = processes.length / currentTime;

  return {  avgWaitingTime, avgTurnaroundTime, avgResponseTime, throughput };
};

const shortestJobNext = (processes) => {
  return shortestJobFirst(processes); 
};