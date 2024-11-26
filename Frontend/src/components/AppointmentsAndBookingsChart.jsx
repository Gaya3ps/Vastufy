// import React, { useEffect, useState } from 'react';
// import { Bar } from 'react-chartjs-2';
// import axios from 'axios';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import axiosInstanceUser from '../services/axiosInstanceUser';

// // Register necessary components from Chart.js
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const AppointmentsAndBookingsChart = () => {
//   const [chartData, setChartData] = useState(null);

//   useEffect(() => {
//     // Fetch booking statistics from the API
//     const fetchBookingData = async () => {
//       try {
//         const response = await axiosInstanceUser.get('/bookings/statistics'); // Modify with your API endpoint
//         const bookings = response.data;
//         console.log(bookings,'111 ');
        

//         // // Prepare data for the chart (assuming response has 'date' and 'count' fields)
//         // const labels = data.map((item) => item.date); // Date of booking
//         // const bookingCounts = data.map((item) => item.count); // Number of bookings on that date

//         // setChartData({
//         //   labels: labels,
//         //   datasets: [
//         //     {
//         //       label: 'Number of Bookings',
//         //       data: bookingCounts,
//         //       backgroundColor: 'rgba(75, 192, 192, 0.6)',
//         //       borderColor: 'rgba(75, 192, 192, 1)',
//         //       borderWidth: 2,
//         //       barThickness: 30,
//         //     },
//         //   ],
//         // });
//       } catch (error) {
//         console.error('Error fetching booking data:', error);
//       }
//     };

//     fetchBookingData();
//   }, []);

//   // Chart options
//   const options = {
//     responsive: true,
//     plugins: {
//       title: {
//         display: true,
//         text: 'Appointments and Bookings Statistics',
//         font: { size: 18 },
//       },
//       tooltip: {
//         mode: 'index',
//         intersect: false,
//         backgroundColor: 'rgba(0, 0, 0, 0.7)',
//         bodyFont: { size: 14 },
//       },
//     },
//     scales: {
//       x: {
//         title: {
//           display: true,
//           text: 'Date',
//         },
//         ticks: {
//           color: '#374151',
//           font: { size: 12 },
//         },
//       },
//       y: {
//         title: {
//           display: true,
//           text: 'Number of Bookings',
//         },
//         beginAtZero: true,
//         ticks: {
//           color: '#374151',
//           font: { size: 12 },
//           stepSize: 1, // Adjust this based on the maximum number of bookings
//         },
//       },
//     },
//   };

//   return (
//     <div className="appointments-bookings-chart">
//       <h2 className="chart-title">Appointments and Bookings</h2>
//       {chartData ? (
//         <div className="w-full h-[28rem]">
//           <Bar data={chartData} options={options} />
//         </div>
//       ) : (
//         <p>Loading booking data...</p>
//       )}
//     </div>
//   );
// };

// export default AppointmentsAndBookingsChart;
