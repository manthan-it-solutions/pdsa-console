import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { apiCall } from "../services/authServieces";

// Register necessary components in Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartComponent = () => {
  const [chartData, setChartData] = useState({
    read: Array(10).fill(0),
    failed: Array(10).fill(0),
    delivered: Array(10).fill(0),
  });

  const getLast10DaysLabels = () => {
    let labels = [];
    let currentDate = new Date();

    for (let i = 0; i < 10; i++) {
      let date = new Date();
      date.setDate(currentDate.getDate() - i);
      
      let formattedDate = date.toLocaleString('default', { month: 'short', day: '2-digit' });
      labels.unshift(formattedDate);
    }

    return labels;
  };

  const dynamicLabels = getLast10DaysLabels();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res = await apiCall({
          endpoint: 'dashboard/get_dashboard_data',
          method: 'GET',
          payload: ''
        });

        // Process the lastTenDaysData to set the chart data
        const lastTenDaysData = res.data.lastTenDaysData;
        const readData = [];
        const failedData = [];
        const deliveredData = [];

        // Initialize data with zeros
        for (let i = 0; i < 10; i++) {
          readData.push(0);
          failedData.push(0);
          deliveredData.push(0);
        }

        // Fill data based on fetched lastTenDaysData
        lastTenDaysData.forEach((item) => {
          if (item.send_date) {
            const sendDateIndex = dynamicLabels.indexOf(
              new Date(item.send_date).toLocaleString('default', { month: 'short', day: '2-digit' })
            );

            if (sendDateIndex >= 0) {
              const total = item.count_delivered + item.count_failed + item.count_seen;

              // Calculate percentage only if the total is greater than 0 to avoid division by zero
              if (total > 0) {
                readData[sendDateIndex] = (item.count_seen / total) * 100;
                failedData[sendDateIndex] = (item.count_failed / total) * 100;
                deliveredData[sendDateIndex] = (item.count_delivered / total) * 100;
              }
            }
          }
        });

        // Update chart data state
        setChartData({ read: readData, failed: failedData, delivered: deliveredData });
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run only once on mount

  // Chart data
  const data = {
    labels: dynamicLabels, 
    datasets: [
      {
        label: 'Read',
        data: chartData.read,
        backgroundColor: '#00acc1',
        borderWidth: 1
      },
      {
        label: 'Failed',
        data: chartData.failed,
        backgroundColor: '#e53935',
        borderWidth: 1
      },
      {
        label: 'Delivered',
        data: chartData.delivered,
        backgroundColor: '#8cc751',
        borderWidth: 1
      }
    ]
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 100, 
        ticks: {
          stepSize: 25,
          callback: function (value) {
            return value + '%';  // Display percentages on y-axis
          }
        }
      }
    }
  };

  return (
    <>
      <h4> HSM Report (Last 10 days)</h4>
      <div className="Bar_contain">
        <Bar data={data} options={options} />
      </div>
    </>
  );
};

export default ChartComponent;
