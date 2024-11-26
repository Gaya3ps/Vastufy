import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axiosInstanceUser from '../../services/axiosInstanceUser';

// Register necessary components from Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PropertyListingsChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Fetch property statistics from the API
    const fetchPropertyData = async () => {
      try {
        const response = await axiosInstanceUser.get('/propertyStats');  // Adjust with your API endpoint
        const data = response.data;

        // Prepare data for the chart (assuming response has 'month' and 'propertyCount' fields)
        const labels = data.map((item) => item.month);  // Month of listing
        const propertyCounts = data.map((item) => item.propertyCount);  // Number of properties listed

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Properties Listed',
              data: propertyCounts,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2,
              barThickness: 30,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching property data:', error);
      }
    };

    fetchPropertyData();
  }, []);

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Property Listings Over Time',
        font: { size: 18 },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        bodyFont: { size: 14 },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month',
        },
        ticks: {
          color: '#374151',
          font: { size: 12 },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Properties',
        },
        beginAtZero: true,
        ticks: {
          color: '#374151',
          font: { size: 12 },
          stepSize: 1,  // Adjust the step size as needed
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center  rounded-lg p-8 max-w-4xl mx-auto mt-10">
      {chartData ? (
        <div className="w-full h-[28rem]">
          <Bar data={chartData} options={options} />
        </div>
      ) : (
        <p>Loading property data...</p>
      )}
    </div>
  );
};

export default PropertyListingsChart;
