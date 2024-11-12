import mongoose, { Schema, Document, Model } from "mongoose";
import { ICategory } from "../../../domain/entities/categoryType";

// Define the interface for the Property document
export interface Property extends Document {
  propertyType: string;
  expectedPrice: number;
  title: string;
  description: string;
  category: ICategory["_id"];
  subcategory: string;
  ownershipStatus: string;
  availableStatus: string;
  saleType: string;
  ageOfProperty: string;
  carpetArea: number;
  builtUpArea: number;
  plotArea: number;
  washrooms: string;
  totalFloors: number;
  floorNo?: number;
  parking: string;
  district: string;
  city: string; 
  locality: string;
  zip: string;
  address: string;
  landmark: string;
  bedrooms: number; 
  balconies: number;
  furnishingStatus: string; 
  powerBackup: string; 
  roadAccessibility: string; 
  locationAdvantages: string[]; 
  mediaUrls: string[];
  amenities: string[];
  is_verified: boolean;
  vendor: mongoose.Types.ObjectId; // Reference to the Vendor
  createdAt: Date;
}

// Define the Property schema
const PropertySchema: Schema = new Schema({
  propertyType: { type: String, required: true },
  expectedPrice: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subcategory: { type: String, required: true },
  ownershipStatus: { type: String, required: true },
  availableStatus: { type: String, required: true },
  saleType: { type: String, required: true },
  ageOfProperty: { type: String, required: true },
  carpetArea: { type: Number, required: true },
  builtUpArea: { type: Number, required: true },
  plotArea: { type: Number, required: true },
  washrooms: { type: String, required: true },
  totalFloors: { type: Number, required: true },
  floorNo: { type: Number, default: null }, // Optional field
  parking: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  locality: { type: String, required: true },
  zip: { type: String, required: true },
  address: { type: String, required: true },
  landmark: { type: String, required: true },
  bedrooms: { type: Number, required: true },
  balconies: { type: Number, required: true }, 
  furnishingStatus: { type: String, required: true }, 
  powerBackup: { type: String, required: true }, 
  roadAccessibility: { type: String, required: true }, 
  mediaUrls: [{ type: String, required: true }],
  amenities: [{ type: String, required: true }],
  locationAdvantages: [{ type: String, required: true }],
  is_verified: { type: Boolean, default: false },
  vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: true }, // Array of amenities
  createdAt: { type: Date, default: Date.now }, // Date property was created
});

// Export the Property model
export const PropertyModel: Model<Property> = mongoose.model<Property>(
  "Property",
  PropertySchema
);
