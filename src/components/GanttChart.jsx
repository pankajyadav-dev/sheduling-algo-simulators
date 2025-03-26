import React from 'react';
import { Chart } from 'chart.js/auto';
import { MdTimeline } from 'react-icons/md';

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
              backgroundColor: 'rgba(20, 20, 30, 0.9)',
              titleFont: {
                size: 14,
                weight: 'bold'
              },
              bodyFont: {
                size: 13
              },
              padding: 12,
              borderColor: 'rgba(80, 120, 220, 0.5)',
              borderWidth: 1,
              displayColors: false,
              callbacks: {
                title: (tooltipItems) => {
                  const dataIndex = tooltipItems[0].dataIndex;
                  const process = data[dataIndex];
                  return `Process P${process.process}`;
                },
                label: (context) => {
                  const dataIndex = context.dataIndex;
                  const process = data[dataIndex];
                  return [
                    `Start Time: ${process.start}`,
                    `End Time: ${process.end}`,
                    `Duration: ${process.end - process.start} time units`
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
                  size: 14,
                  weight: 'bold',
                  family: "'Helvetica Neue', 'Arial', sans-serif"
                },
                padding: {top: 15, bottom: 5},
                color: 'rgba(180, 190, 210, 0.9)'
              },
              grid: {
                display: false
              },
              ticks: {
                font: {
                  size: 13,
                  weight: '600'
                },
                color: 'rgba(180, 190, 210, 0.8)'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Time Units',
                font: {
                  size: 14,
                  weight: 'bold',
                  family: "'Helvetica Neue', 'Arial', sans-serif"
                },
                padding: {top: 5, bottom: 10},
                color: 'rgba(180, 190, 210, 0.9)'
              },
              beginAtZero: true,
              grid: {
                color: 'rgba(80, 80, 95, 0.15)',
                lineWidth: 0.5
              },
              ticks: {
                font: {
                  size: 12
                },
                color: 'rgba(180, 190, 210, 0.8)',
                padding: 8
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
    <div>
      <div className="flex items-center mb-6">
        <MdTimeline className="text-blue-400 text-2xl md:text-3xl mr-2" />
        <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
          Process Timeline
        </h2>
      </div>
      
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/70 rounded-xl border border-gray-700/30 shadow-lg p-5 mb-6">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div>
            <p className="text-gray-300 text-sm">
              <span className="font-semibold">Total Processes:</span> {data.length}
            </p>
          </div>
          <div className="text-xs text-gray-400">
            Hover over bars for detailed information
          </div>
        </div>
        
        <div className="relative" style={{ height: '380px', width: '100%' }}>
          <canvas ref={chartRef} />
        </div>
        
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {data.slice(0, 5).map((item, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: colorMapRef.current[item.process] || 'rgba(100, 120, 220, 0.8)' }}
              ></div>
              <span className="text-xs text-gray-300">P{item.process}</span>
            </div>
          ))}
          {data.length > 5 && (
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2 bg-gray-500"></div>
              <span className="text-xs text-gray-300">+{data.length - 5} more</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GanttChart;