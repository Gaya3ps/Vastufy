import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";

const SearchSortFilter = ({
  data,
  searchFields,
  onDataChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [propertyType, setPropertyType] = useState(""); // New state for Property Type filter

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
  };

  const handlePropertyTypeFilter = (value) => {
    setPropertyType(value);
    // Apply property type filter when it changes
    const updatedFilters = activeFilters.filter(
      (filter) => filter.field !== "propertyType"
    );
    if (value) {
      updatedFilters.push({ field: "propertyType", value });
    }
    setActiveFilters(updatedFilters);
  };

  useEffect(() => {
    let result = [...data];

    // Apply search
    if (searchTerm) {
      result = result.filter((item) =>
        searchFields.some((field) =>
          String(item[field]).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply property type filter
    if (propertyType) {
      result = result.filter(
        (item) => String(item.propertyType).toLowerCase() === propertyType.toLowerCase()
      );
    }

    // Pass the filtered and sorted data to the parent
    onDataChange(result);
  }, [searchTerm, activeFilters, propertyType, data]);

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-wrap gap-6 justify-center p-4">
        {/* Search Input */}
        <div className="relative flex-grow max-w-md">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Property Type Filter Dropdown */}
        <div className="relative flex-grow max-w-md">
          <select
            value={propertyType}
            onChange={(e) => handlePropertyTypeFilter(e.target.value)}
            className="pl-4 pr-8 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Property Type
            </option>
            <option value="sell">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchSortFilter;
  