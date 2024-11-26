import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import PropertyCard from "../../components/PropertyCard";
import SearchSortFilter from "../../components/SearchSortFilter";
import axiosInstanceUser from "../../services/axiosInstanceUser";

function Properties() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Define search, sort, and filter options
  const searchFields = ["title", "location", "description"];



  const fetchProperties = async () => {
    try {
      const response = await axiosInstanceUser.get("/properties");
      setProperties(response.data.properties);
      setFilteredProperties(response.data.properties);
      setLoading(false);
    } catch (error) {
      setError("Error fetching properties");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleScroll = () => {
    if (window.scrollY > lastScrollY) {
      setShowHeader(false);
    } else {
      setShowHeader(true);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const handleDataChange = (filteredData) => {
    setFilteredProperties(filteredData);
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <p className="text-lg font-semibold text-gray-700">
            Loading properties...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <p className="text-red-500 text-lg font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {showHeader && <Header />}

      <div className={`max-w-7xl mx-auto px-4 ${showHeader ? "mt-36" : "mt-12"}`}>
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">
          Available Properties
        </h1>

        {/* Centered Search, Sort, and Filter Section */}
        <div className="mb-8 flex justify-center gap-8 items-center">
          {/* Existing SearchSortFilter Component */}
          <SearchSortFilter
            data={properties}
            searchFields={searchFields}
            onDataChange={handleDataChange}
          />
        </div>

        {/* Properties Grid */}
        <div className="mt-8">
          {filteredProperties.length === 0 ? (
            <p className="text-center text-gray-600">
              No properties match your criteria.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProperties.map((property) => (
                <div className="max-w-full">
                  <PropertyCard key={property._id} property={property} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Properties;
