import React from 'react';
import { Chart } from 'chart.js/auto';

function GanttChart({ data }) {
  const chartRef = React.useRef(null);
  const chartInstanceRef = React.useRef(null);

  React.useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');


      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }


      chartInstanceRef.current = new Chart(ctx, {
        type: 'bar',
        // type: 'line',
        data: {
          labels: data.map((d) => d.process),
          datasets: [
            {
              label: 'Burst Time',
              data: data.map((d) => d.end - d.start),
              backgroundColor: 'rgba(33, 0, 219, 0.2)',
              borderColor: 'rgb(0, 243, 231)',
              borderWidth: 2,
            },
          ],
        },
        options: {
          scales: {
            x: { title: { display: true, text: 'Processes' } },
            y: { title: { display: true, text: 'Time' } },
          },
        },
      });
    }
  }, [data]);

 
  React.useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  return <canvas ref={chartRef} />;
}

export default GanttChart;