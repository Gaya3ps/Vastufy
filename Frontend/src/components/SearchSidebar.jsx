import React, { useState } from 'react';

function SearchSidebar() {
  const [propertyType, setPropertyType] = useState('sell'); // Default to 'buy'
  const [category, setCategory] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [propertyName, setPropertyName] = useState(''); // New state for property name search

  const handleSearch = () => {
    const searchCriteria = {
      propertyType,
      category,
      district,
      city,
      propertyName, // Include property name in search criteria
    };

    // You can pass searchCriteria to a function (e.g., onSearch) to filter the properties
    console.log(searchCriteria); // Example for debugging
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
              value="sell"
              checked={propertyType === 'sell'}
              onChange={() => setPropertyType('sell')}
            />
            <span>Sell</span>
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
          <option value="residential">Residential</option>
          <option value="agri">Agri</option>
          <option value="agricultureeeee">Agricultureeeee</option>
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
          <option value="pathanamthitta">Pathanamthitta</option>
          <option value="alappuzha">Alappuzha</option>
          <option value="kottayam">Kottayam</option>
          <option value="idukki">Idukki</option>
          <option value="ernakulam">Ernakulam</option>
          <option value="thrissur">Thrissur</option>
          <option value="palakkad">Palakkad</option>
          <option value="malappuram">Malappuram</option>
          <option value="kozhikode">Kozhikode</option>
          <option value="wayanad">Wayanad</option>
          <option value="Kannur">Kannur</option>
          <option value="kasaragod">Kasaragod</option>
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

      {/* Property Name Search */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-2">Search by Property Name</h3>
        <input
          type="text"
          placeholder="Enter property name"
          value={propertyName}
          onChange={(e) => setPropertyName(e.target.value)}
          className="w-full p-2 border rounded"
        />
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
