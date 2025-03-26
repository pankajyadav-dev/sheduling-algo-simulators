import mongoose from 'mongoose';

const processSchema = new mongoose.Schema({
  id: String,
  arrivalTime: Number,
  burstTime: Number,
  priority: Number,
  queueId: { type: Number, default: 0 }
});

const ganttChartItemSchema = new mongoose.Schema({
  process: String,
  start: Number,
  end: Number
});

const simulationSchema = new mongoose.Schema({
  name: {
    type: String,
    default: function() {
      return `Simulation ${new Date().toLocaleString()}`;
    }
  },
  algorithm: {
    type: String,
    required: true
  },
  timeQuantum: {
    type: Number,
    default: 1
  },
  processes: [processSchema],
  ganttData: [ganttChartItemSchema],
  metrics: {
    averageWaitingTime: Number,
    averageTurnaroundTime: Number,
    avgResponseTime: Number,
    throughput: Number,
    bestAlgorithm: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Simulation = mongoose.model('Simulation', simulationSchema);

export default Simulation; 