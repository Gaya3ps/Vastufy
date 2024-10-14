
  
//  import mongoose, { Document, Schema } from "mongoose";

//  export interface Service {
//      name: string;
//      price: number;
//  }
 
//  export interface VendorDocument extends Document {
//      name: string;
//      email: string;
//     //  city: string;
//     //  eventname: string;
//      password: string;
//     //  logoUrl?: string;
//      licenseUrl?: string;
//     //  logo: string;
//      coverpicture: string;
//      about: string;
//      mobileNumber: number; 
//      address: string;
//     //  services: Service[];
//      is_verified: boolean;
//      is_blocked: boolean;
//     //  total_bookings: number;
//      otp_verified: boolean;
//  }
 

 
//  export interface UpdateVendorData {
//    name?: string;
//    mobileNumber?: string; 
//    address?: string;
//  }
 
//  const vendorSchema = new Schema<VendorDocument>({
//      name: { type: String, required: true },
//      email: { type: String, required: true, unique: true },
//      password: { type: String, required: true },
//      licenseUrl: { type: String },
//      mobileNumber: { type: Number, required: true }, 
//      address: { type: String, required: false },      
//      coverpicture: { type: String },
//      about: { type: String },
//      is_verified: { type: Boolean, default: false },
//      is_blocked: { type: Boolean, default: false },
//      otp_verified: { type: Boolean, default: false },
//  });
 
//  export const Vendor = mongoose.model<VendorDocument>('Vendor', vendorSchema);
 


import mongoose, { Document, Schema, Types } from "mongoose"; // Import Types for ObjectId

export interface Service {
  name: string;
  price: number;
}

export interface VendorDocument extends Document {
  name: string;
  email: string;
  password: string;
  licenseUrl?: string;
  mobileNumber: number; 
  address: string;
  coverpicture: string;
  about: string;
  is_verified: boolean;
  is_blocked: boolean;
  properties: Types.ObjectId[];
  otp_verified: boolean;
  // Add the license field here as an ObjectId reference to License
  license?: Types.ObjectId; // Optional, as the license might not be assigned initially
}

export interface UpdateVendorData {
  name?: string;
  mobileNumber?: string; 
  address?: string;
}

const vendorSchema = new Schema<VendorDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  licenseUrl: { type: String },
  mobileNumber: { type: Number, required: true }, 
  address: { type: String, required: false },      
  coverpicture: { type: String },
  about: { type: String },
  is_verified: { type: Boolean, default: false },
  is_blocked: { type: Boolean, default: false },
  otp_verified: { type: Boolean, default: false },
  // Add the reference to the License model
  license: { type: Schema.Types.ObjectId, ref: 'License' } ,
  properties: [{ type: Schema.Types.ObjectId, ref: 'Property' }],
});

export const Vendor = mongoose.model<VendorDocument>('Vendor', vendorSchema);
