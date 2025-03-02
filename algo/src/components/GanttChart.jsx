import React from 'react';
import { Chart } from 'chart.js/auto';

function GanttChart({ data }) {
  const chartRef = React.useRef(null);
  const chartInstanceRef = React.useRef(null);
  const colorMapRef = React.useRef({});

  React.useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }


      const generatePastelColor = () => {
        const hue = Math.floor(Math.random() * 360);
        return `hsla(${hue}, 85%, 75%, 0.85)`;
      };


      const getProcessColor = (processId) => {
        if (!colorMapRef.current[processId]) {
          colorMapRef.current[processId] = generatePastelColor();
        }
        return colorMapRef.current[processId];
      };

      const processColors = data.map(d => getProcessColor(d.process));

      chartInstanceRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.map((d) => `P${d.process}`),
          datasets: [
            {
              label: 'Process Timeline',
              data: data.map((d) => d.end - d.start),
              backgroundColor: processColors,
              borderColor: processColors.map(color => color.replace('0.85', '1')),
              borderWidth: 2,
              borderRadius: 8,
              barPercentage: 0.9,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleFont: {
                size: 14,
                weight: 'bold'
              },
              padding: 12,
              callbacks: {
                label: (context) => {
                  const dataIndex = context.dataIndex;
                  const process = data[dataIndex];
                  return [
                    `Process: P${process.process}`,
                    `Start Time: ${process.start}`,
                    `End Time: ${process.end}`,
                    `Duration: ${process.end - process.start}`
                  ];
                }
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Process ID',
                font: {
                  size: 16,
                  weight: 'bold',
                  family: "'Helvetica Neue', 'Arial', sans-serif"
                },
                padding: 15
              },
              grid: {
                display: false
              },
              ticks: {
                font: {
                  size: 13,
                  weight: '600'
                }
              }
            },
            y: {
              title: {
                display: true,
                text: 'Time Units',
                font: {
                  size: 16,
                  weight: 'bold',
                  family: "'Helvetica Neue', 'Arial', sans-serif"
                },
                padding: 15
              },
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
                lineWidth: 0.5
              },
              ticks: {
                font: {
                  size: 12
                }
              }
            }
          },
          animation: {
            duration: 1200,
            easing: 'easeInOutQuart'
          }
        }
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

  return (
    <div style={{ height: '400px', width: '100%', padding: '20px' }}>
      <canvas ref={chartRef} />
    </div>
  );
}

export default GanttChart;