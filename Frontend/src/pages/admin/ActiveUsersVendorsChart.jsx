import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axiosInstanceUser from '../../services/axiosInstanceUser';
import axiosInstanceVendor from '../../services/axiosInstanceVendor';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function ActiveUsersVendorsChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axiosInstanceUser.get('/userCount');
        const vendorResponse = await axiosInstanceVendor.get('/vendorCount');

        const activeUserCount = userResponse.data;
        const activeVendorCount = vendorResponse.data.count;

        setChartData({
          labels: ['Active Users', 'Active Vendors'],
          datasets: [
            {
              label: 'Active Counts',
              data: [activeUserCount, activeVendorCount],
              backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
              borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching active counts:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center rounded-lg p-6 max-w-4xl mx-auto mt-10">
      {chartData ? (
        <div className="w-full max-w-2xl" style={{ width: '400px', height: '400px' }}>
          <Pie
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: 'Active Users and Vendors', 
                  font: {
                    size: 18,
                    weight: 'bold',
                  },
                },
                legend: {
                  position: 'bottom', // Position legend at the bottom for a compact look
                },
              },
            }}
          />
        </div>
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
}

export default ActiveUsersVendorsChart;
