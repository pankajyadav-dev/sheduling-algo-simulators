import React from 'react';
import { Chart } from 'chart.js/auto';

function GanttChart({ data }) {
  const chartRef = React.useRef(null);
  const chartInstanceRef = React.useRef(null);

  React.useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      // Destroy the previous chart instance if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Create a new chart instance
      chartInstanceRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.map((d) => d.process),
          datasets: [
            {
              label: 'Burst Time',
              data: data.map((d) => d.end - d.start),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
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

  // Cleanup the chart instance when the component unmounts
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