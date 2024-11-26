import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axiosInstanceUser from '../../services/axiosInstanceUser';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function BookingChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await axiosInstanceUser.get('/allbookings');
        console.log("Booking data:", response.data);
        
        const bookings = response.data;

        // Format data for the chart
        const labels = bookings.map((booking) => booking.date);
        const data = bookings.map((booking) => booking.count);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Bookings',
              data,
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 2,
              borderRadius: 10,
              barThickness: 25,
              hoverBackgroundColor: 'rgba(54, 162, 235, 1)',
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching booking data:', error);
      }
    };

    fetchBookingData();
  }, []);

  return (
    <div className="flex flex-col items-center rounded-lg p-8 max-w-4xl mx-auto mt-10">
      {chartData ? (
        <div className="w-full h-[28rem]">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: 'Booking Chart', // Set the title here
                  font: {
                    size: 20,
                    weight: 'bold',
                  },
                },
                legend: {
                  display: true,
                  position: 'top',
                  labels: {
                    font: { size: 14 },
                    color: '#4b5563',
                    padding: 20,
                  },
                },
                tooltip: {
                  backgroundColor: 'rgba(54, 162, 235, 0.9)',
                  titleFont: { size: 14 },
                  bodyFont: { size: 12 },
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1,
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Date',
                    color: '#6b7280',
                    font: { size: 16, weight: 'bold' },
                  },
                  ticks: {
                    color: '#374151',
                    font: { size: 12 },
                  },
                },
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Number of Bookings',
                    color: '#6b7280',
                    font: { size: 16, weight: 'bold' },
                  },
                  ticks: {
                    color: '#374151',
                    font: { size: 12 },
                    stepSize: 2,  // Set custom step size for intervals
                    callback: function(value) {
                      return value % 2 === 0 ? value : ''; // Only show even numbers
                    },
                  },
                  grid: {
                    color: 'rgba(229, 231, 235, 0.5)',
                  },
                },
              },
            }}
          />
        </div>
      ) : (
        <p className="text-gray-500 mt-4">Loading chart data...</p>
      )}
    </div>
  );
}

export default BookingChart;
