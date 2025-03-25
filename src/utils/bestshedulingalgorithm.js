
export const calculatebestSchedulingalgo = (processes, timeQuantum = 2) => {
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

    let bestAlgorithm = null;
    let bestATAT = Infinity;
    let bestAWT = Infinity;

    for (const [algo, { avgWaitingTime, avgTurnaroundTime }] of Object.entries(results)) {

        if (avgTurnaroundTime < bestATAT) {
            bestAlgorithm = algo;
            bestATAT = avgTurnaroundTime;
            bestAWT = avgWaitingTime;
        }
        else if (avgTurnaroundTime === bestATAT) {
            if (avgWaitingTime < bestAWT) {
                bestAlgorithm = algo;
                bestAWT = avgWaitingTime;
            }
        }
    }

    return bestAlgorithm;

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
    return {  avgWaitingTime, avgTurnaroundTime };
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
    return {  avgWaitingTime, avgTurnaroundTime };
  };
  
  
  
  
  
  
  
  
  
  
  const multilevelQueueScheduling = (processes, timeQuantum = 2) => {
    // Update 1: Validate input processes
    if (!processes || processes.length === 0) {
        throw new Error('Invalid input: Processes array is empty or undefined');
    }

    let schedule = [];
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
    
    // Update 2: Create a deep copy of processes to avoid modifying original data
    const processQueue = processes.map(p => ({
        ...p, 
        remainingTime: p.burstTime,
        originalBurstTime: p.burstTime
    }));

    // Update 3: Organize processes into queues based on priority/queue levels
    const queues = {};
    processQueue.forEach((process) => {
        if (!queues[process.queueId]) {
            queues[process.queueId] = [];
        }
        queues[process.queueId].push(process);
    });

    // Update 4: Sort queue IDs in ascending order
    const sortedQueueIds = Object.keys(queues)
        .map(Number)
        .sort((a, b) => a - b);

    let currentTime = 0;
    let completedProcesses = 0;

    // Update 5: Improved scheduling loop
    while (completedProcesses < processQueue.length) {
        let processExecuted = false;

        // Iterate through queues in priority order
        for (let queueId of sortedQueueIds) {
            // Update 6: Filter and sort processes in current queue
            let readyProcesses = queues[queueId]
                .filter(p => p.remainingTime > 0 && p.arrivalTime <= currentTime)
                .sort((a, b) => a.arrivalTime - b.arrivalTime || a.priority - b.priority);

            if (readyProcesses.length === 0) continue;

            // Select the first ready process
            let process = readyProcesses[0];
            
            // Update 7: Execute process with appropriate time quantum
            let executeTime = Math.min(timeQuantum, process.remainingTime);
            
            // Add to schedule
            schedule.push({ 
                process: process.id, 
                start: currentTime, 
                end: currentTime + executeTime 
            });

            // Update process details
            currentTime += executeTime;
            process.remainingTime -= executeTime;

            processExecuted = true;

            // Check if process is completed
            if (process.remainingTime === 0) {
                completedProcesses++;
                
                // Calculate waiting and turnaround times
                let turnaroundTime = currentTime - process.arrivalTime;
                let waitingTime = turnaroundTime - process.originalBurstTime;

                totalTurnaroundTime += turnaroundTime;
                totalWaitingTime += waitingTime;
            }

            // Break after executing one process to allow other queues a chance
            break;
        }

        // Update 8: Handle case where no process is ready
        if (!processExecuted) {
            let nextProcess = processQueue
                .filter(p => p.remainingTime > 0)
                .sort((a, b) => a.arrivalTime - b.arrivalTime)[0];

            if (nextProcess) {
                currentTime = nextProcess.arrivalTime;
            } else {
                break;
            }
        }
    }

    // Calculate average waiting and turnaround times
    const avgWaitingTime = totalWaitingTime / processes.length;
    const avgTurnaroundTime = totalTurnaroundTime / processes.length;

    return { 
        avgWaitingTime, 
        avgTurnaroundTime
    };
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
    return {  avgWaitingTime, avgTurnaroundTime };
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
    return {  avgWaitingTime, avgTurnaroundTime };
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
    return {  avgWaitingTime, avgTurnaroundTime };
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
    return {  avgWaitingTime, avgTurnaroundTime };
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
    return {  avgWaitingTime, avgTurnaroundTime };
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
    return {  avgWaitingTime, avgTurnaroundTime };
  };
  
  
  
  
  
  
  
  
  const shortestJobNext = (processes) => {
    return shortestJobFirst(processes); 
  };