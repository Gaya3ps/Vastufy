import React from 'react';

const Table = ({ headers, data }) => {
  return (
    <div className="overflow-x-auto max-h-[500px] overflow-y-auto border border-gray-300 rounded-lg shadow-md">
      <table className="min-w-full bg-white border-collapse border-gray-300 shadow-md rounded-lg font-poppins">
        <thead className="bg-gradient-to-r from-[#B85042] to-[#8B3D2F] text-white text-lg font-semibold tracking-wide">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="py-5 px-8 text-left  sticky top-0  border-b border-gray-200 text-xl"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-700 text-md font-light">
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`border-b border-gray-200 hover:bg-[#F4F4F4] transition-all duration-300 ${rowIndex % 2 === 0 ? 'bg-[#F9F9F9]' : ''}`}
              >
                {Object.values(row).map((value, colIndex) => (
                  <td
                    key={colIndex}
                    className="py-5 px-8 text-left whitespace-nowrap text-md"
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="text-center py-5 text-gray-500">
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

