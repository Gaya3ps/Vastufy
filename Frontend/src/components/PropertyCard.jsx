import React from "react";
import { Link } from "react-router-dom";

function PropertyCard({ property }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-transform transform hover:-translate-y-1 duration-300 w-full flex flex-col h-full">
      {/* Property Image */}
      {property.mediaUrls && property.mediaUrls.length > 0 ? (
        <img
          src={property.mediaUrls[0]} // Display first image from the array
          alt={property.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-300 flex items-center justify-center text-gray-500">
          No Image Available
        </div>
      )}

      {/* Property Details */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 mb-2 truncate">{property.title}</h2>

        {/* Price */}
        <p className="text-md text-blue-600 font-bold mb-2">
          ₹{new Intl.NumberFormat("en-IN").format(property.expectedPrice)}
        </p>

        {/* Location */}
        <p className="text-sm text-gray-500 mb-2 flex items-center">
          <span role="img" aria-label="location" className="mr-2">
            📍
          </span>
          {property.address}
        </p>

        {/* Category and Status */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-gray-500">
            <span role="img" aria-label="category" className="mr-1">
              🏢
            </span>
            {property.category?.name || "N/A"}
          </p>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              property.availableStatus === "For Sale"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {property.availableStatus}
          </span>
        </div>

        {/* Property Features */}
        <div className="flex items-center justify-between text-xs text-gray-600 space-x-2 mb-3">
          <div className="flex items-center space-x-1">
            <span role="img" aria-label="bedrooms" className="text-lg">
              🛏️
            </span>
            <span>{property.bedrooms} Br</span>
          </div>

          <div className="flex items-center space-x-1">
            <span role="img" aria-label="bathrooms" className="text-lg">
              🛁
            </span>
            <span>{property.washrooms} Ba</span>
          </div>

          <div className="flex items-center space-x-1">
            <span role="img" aria-label="size" className="text-lg">
              📐
            </span>
            <span>{property.carpetArea} sq.ft.</span>
          </div>
        </div>

        {/* View Details Button */}
        <div className="mt-auto">
          <Link to={`/propertydetails/${property._id}`}>
            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 text-sm">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;
