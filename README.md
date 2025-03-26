# Progess Report
-Created Frontend Basic interface
  -setup project by using React-vite and other basic dependencies
  -Create the basic module of the frontend (processinput , metric, Algorithm selector, Gantchart preview)
-Created basic javascript logic to process the shedule of the process sets in the form of function
  -implement all cpu sheduling algorithm as a function in shedulingalgorithm.js
-Update the Gui and make it more attractive and easy to use to the user
-Created a backend
  -setup the Nodejs and created server.js
  -add the file to calculate the process shecdule and the best algorithm which perform best in this particular case
  -connect the api.js of frontend to the server.js
-Host on the vercel both frontend and backend

# CPU Scheduler Simulator

A modern web application for simulating and visualizing various CPU scheduling algorithms. It helps users understand how different scheduling algorithms work and analyze their performance metrics.

## Features

- Simulate multiple CPU scheduling algorithms:
  - FCFS (First Come First Served)
  - SJF (Shortest Job First)
  - SRTF (Shortest Remaining Time First)
  - Priority Scheduling
  - Round Robin
  - Multilevel Queue
  - HRRN (Highest Response Ratio Next)
  - LJF (Longest Job First)
  - LRTF (Longest Remaining Time First)
- Visualize the execution timeline with an interactive Gantt chart
- Calculate and display performance metrics:
  - Average Waiting Time
  - Average Turnaround Time
  - Average Response Time
  - Throughput
- Get recommendations for the best algorithm based on customizable weights
- Save simulations to a MongoDB database for future reference
- View and manage saved simulations
- Download simulation results as images

## Tech Stack

- **Frontend**: React, Chart.js, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB

## Setup Instructions
### Installation

1. Clone the repository:

```
git clone https://github.com/pankajyadav-dev/sheduling-algo-simulators.git
cd sheduling-algo-simulators
```

2. Install frontend dependencies:

```
npm install
```

3. Install server dependencies:

```
cd server
npm install
```

4. Configure environment variables:
   - Create a `.env` file in the server directory
   - Add the following variables:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/cpuscheduler 
     ```
   - Replace the MongoDB URI with your own connection string

### Running the Application

1. Start the backend server:

```
cd server
npm run dev
```

2. In a separate terminal, start the frontend:

```
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Select a CPU scheduling algorithm from the dropdown
2. For Round Robin and Multilevel Queue, set the time quantum
3. Add processes with their arrival time, burst time, and priority
4. Click on "Simulate" to run the algorithm
5. View the Gantt chart and performance metrics
6. Save simulations or download the results as images
7. Access saved simulations from the "Saved Simulations" page



