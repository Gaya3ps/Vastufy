// import React from 'react';

// // Reusable Table Component
// const Table = ({ headers, data }) => {
//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg font-poppins">
//         <thead>
//           <tr className="bg-gray-200 text-gray-700 uppercase text-sm font-semibold leading-normal">
//             {headers.map((header, index) => (
//               <th
//                 key={index}
//                 className="py-3 px-6 text-left"
//               >
//                 {header}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody className="text-gray-600 text-sm font-light">
//           {data.length > 0 ? (
//             data.map((row, rowIndex) => (
//               <tr
//                 key={rowIndex}
//                 className="border-b border-gray-200 hover:bg-gray-100 transition-colors"
//               >
//                 {Object.values(row).map((value, colIndex) => (
//                   <td
//                     key={colIndex}
//                     className="py-3 px-6 text-left whitespace-nowrap"
//                   >
//                     {value}
//                   </td>
//                 ))}
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={headers.length} className="text-center py-4 text-gray-500">
//                 No data available.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Table;





import React from 'react';

// Reusable Table Component
const Table = ({ headers, data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg font-poppins">
        <thead>
          <tr className="bg-gray-200 text-gray-700 uppercase text-sm font-semibold leading-normal">
            {headers.map((header, index) => (
              <th
                key={index}
                className="py-3 px-6 text-left w-1/4" // Ensure columns have a consistent width
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-gray-200 hover:bg-gray-100 transition-colors"
              >
                {Object.values(row).map((value, colIndex) => (
                  <td
                    key={colIndex}
                    className="py-3 px-6 text-left whitespace-nowrap w-1/4" // Fixed width for stability
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="text-center py-4 text-gray-500">
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

