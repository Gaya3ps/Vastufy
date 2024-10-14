// PropertyDataRequest Interface
export interface PropertyDataRequest {
    propertyType: string;           // Rent or Sell
    expectedPrice: number;          // Expected price for the property
    title: string;                  // Title or name of the property
    description: string;            // Description of the property
    category: string;               // Category of the property (e.g., Residential, Commercial)
    subcategory: string;            // Subcategory (e.g., Apartment, Villa)
    ownershipStatus: string;        // Owned, Rented, etc.
    availableStatus: string;        // Ready to move, Under construction, etc.
    saletype: string;               // New, Resale, etc. (keep lowercase to match your console log)
    ageofproperty: string;          // Age of the property (e.g., 1-5 years, 10+ years)
    carpetArea: number;             // Carpet area in square feet
    builtUpArea: number;            // Built-up area in square feet
    plotArea: number;               // Plot area in square feet or acres
    washrooms: string;              // Number of washrooms (1, 2, etc.)
    totalFloors: number;            // Total number of floors in the building
    floorNo?: number;               // Floor number of the property (optional)
    parking: string;                // Parking availability (Yes/No)
    media: Express.Multer.File[];   // Array of media files (images, videos)
    amenities: string[];            // List of amenities (e.g., School, Hospital, etc.)
    district: string;               // District where the property is located
    locality: string;               // Locality of the property
    zip: string;                    // Zip or postal code
    address: string;                // Full address of the property
    landmark: string;               // Nearby landmark of the property
}



  // PropertyDataResponse Interface
export interface PropertyDataResponse {
    propertyType: string;            // Rent or Sell
    expectedPrice: number;           // Expected price for the property
    title: string;                   // Title or name of the property
    description: string;             // Description of the property
    category: string;                // Category of the property
    subcategory: string;             // Subcategory of the property
    ownershipStatus: string;         // Ownership status (Owned, Rented, etc.)
    availableStatus: string;         // Availability status (Ready to move, etc.)
    saletype: string;                // Sale type (New, Resale, etc.)
    ageofproperty: string;           // Age of the property (e.g., 1-5 years, 10+ years)
    carpetArea: number;              // Carpet area in square feet
    builtUpArea: number;             // Built-up area in square feet
    plotArea: number;                // Plot area in square feet
    washrooms: string;               // Number of washrooms
    totalFloors: number;             // Total number of floors in the building
    floorNo?: number;                // Floor number of the property (optional)
    parking: string;                 // Parking status (Available, Not Available)
    mediaUrls: string[];             // URLs of the uploaded media files (images/videos)
    amenities: string[];             // List of amenities (e.g., School, Hospital, etc.)
    district: string;                // District where the property is located
    locality: string;                // Locality of the property
    zip: string;                     // Zip or postal code
    address: string;                 // Full address of the property
    landmark: string;                // Nearby landmark of the property
    createdAt: Date;                 // Timestamp when the property was created
}
