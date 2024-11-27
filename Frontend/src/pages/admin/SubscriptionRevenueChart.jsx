import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import axiosInstanceVendor from '../../services/axiosInstanceVendor';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SubscriptionRevenueChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await axiosInstanceVendor.get('/subscriptionRevenue');
        const data = response.data;
        console.log(data, "Subscription Revenue Dataaaaaaaa");

        // Group data by date and sum up the revenue
        const revenueByDate = {};

        // Iterate over the data and accumulate revenue by date
        data.forEach((item) => {
          const date = new Date(item.purchaseDate).toISOString().split('T')[0]; // Extract just the date (YYYY-MM-DD)
          const price = item.subscription.price;

          if (revenueByDate[date]) {
            revenueByDate[date] += price; // Sum the revenue for each day
          } else {
            revenueByDate[date] = price; // Initialize with the first value
          }
        });

        // Prepare data for the chart
        const labels = Object.keys(revenueByDate); // Get the dates (labels)
        const revenueData = Object.values(revenueByDate); // Get the summed revenue for each date

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Total Revenue from Subscriptions',
              data: revenueData,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
              tension: 0.4
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching subscription revenue data:', error);
      }
    };

    fetchRevenueData();
  }, []);

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Revenue from Subscriptions Over Time',
        font: { size: 18 }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        bodyFont: { size: 14 }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date'
        },
        ticks: {
          color: '#374151',
          font: { size: 12 },
        }
      },
      y: {
        title: {
          display: true,
          text: 'Revenue (₹)'
        },
        beginAtZero: true,
        ticks: {
          color: '#374151',
          font: { size: 12 },
          stepSize: 500, // Adjust based on your revenue data
        }
      }
    }
  };

  return (
    <div className="subscription-revenue-chart">
      {chartData ? (
        <Line data={chartData} options={options} />
      ) : (
        <p>Loading subscription revenue data...</p>
      )}
    </div>
  );
};

export default SubscriptionRevenueChart;
