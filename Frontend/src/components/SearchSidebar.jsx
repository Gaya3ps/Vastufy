// function SearchSidebar() {
//     return (
//       <div className="w-64 bg-white p-6 shadow-md">
//         <h2 className="text-lg font-semibold mb-4">Find Your Property</h2>
        
//         <div className="space-y-4">
//           {/* Buy, Rent, Lease Filters */}
//           <div>
//             <label className="block mb-2 text-gray-600">What kind of property you want?</label>
//             <select className="w-full border p-2 rounded">
//               <option value="">Select</option>
//               <option value="buy">Buy</option>
//               <option value="rent">Rent</option>
//               <option value="lease">Lease</option>
//             </select>
//           </div>
  
//           {/* Property ID or Title Search */}
//           <div>
//             <label className="block mb-2 text-gray-600">Search by Property ID or Title</label>
//             <input type="text" placeholder="Search..." className="w-full border p-2 rounded" />
//           </div>
  
//           {/* District Filter */}
//           <div>
//             <label className="block mb-2 text-gray-600">Search by District</label>
//             <select className="w-full border p-2 rounded">
//               <option value="">Select District</option>
//               {/* Add options here */}
//             </select>
//           </div>
  
//           {/* Verified & RERA Registered Filter */}
//           <div className="flex items-center space-x-4">
//             <label className="flex items-center space-x-2">
//               <input type="checkbox" className="form-checkbox" />
//               <span>Verified properties</span>
//             </label>
//             <label className="flex items-center space-x-2">
//               <input type="checkbox" className="form-checkbox" />
//               <span>RERA Registered Properties</span>
//             </label>
//           </div>
//         </div>
//       </div>
//     );
//   }
  


  import React, { useState } from 'react';

  function SearchSidebar() {
    const [propertyType, setPropertyType] = useState('buy'); // Default to 'buy'
    const [category, setCategory] = useState('');
    const [district, setDistrict] = useState('');
    const [city, setCity] = useState('');
    const [verified, setVerified] = useState(false);
    const [reraRegistered, setReraRegistered] = useState(false);
  
    const handleSearch = () => {
      // Implement search logic here
      console.log({
        propertyType,
        category,
        district,
        city,
        verified,
        reraRegistered
      });
    };
  
    return (
      <div className="w-64 bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Find Your Property</h2>
  
        {/* Property Type (Buy, Rent, Lease) */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2">What kind of property do you want?</h3>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="propertyType"
                value="buy"
                checked={propertyType === 'buy'}
                onChange={() => setPropertyType('buy')}
              />
              <span>Buy</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="propertyType"
                value="rent"
                checked={propertyType === 'rent'}
                onChange={() => setPropertyType('rent')}
              />
              <span>Rent</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="propertyType"
                value="lease"
                checked={propertyType === 'lease'}
                onChange={() => setPropertyType('lease')}
              />
              <span>Lease</span>
            </label>
          </div>
        </div>
  
        {/* Category Selection */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2">Category</h3>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Category</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="land">Land</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>
  
        {/* District Selection */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2">Search by District</h3>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select District</option>
            <option value="thiruvananthapuram">Thiruvananthapuram</option>
            <option value="kollam">Kollam</option>
            <option value="ernakulam">Ernakulam</option>
            <option value="kozhikode">Kozhikode</option>
          </select>
        </div>
  
        {/* City Selection */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2">Search by City</h3>
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
  
        {/* Additional Filters */}
        <div className="mb-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={verified}
              onChange={() => setVerified(!verified)}
            />
            <span>Verified properties</span>
          </label>
          <label className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              checked={reraRegistered}
              onChange={() => setReraRegistered(!reraRegistered)}
            />
            <span>RERA Registered Properties</span>
          </label>
        </div>
  
        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Search
        </button>
      </div>
    );
  }
  
  export default SearchSidebar;
  
  