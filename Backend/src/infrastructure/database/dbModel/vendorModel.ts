
import mongoose, { Document, Schema, Types } from "mongoose"; 

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
  license?: Types.ObjectId; 
  subscriptionPlan?: Types.ObjectId; 
  maxListings: number; 
  listingsUsed: number;
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
  license: { type: Schema.Types.ObjectId, ref: 'License' } ,
  properties: [{ type: Schema.Types.ObjectId, ref: 'Property' }],
  subscriptionPlan: { type: Schema.Types.ObjectId, ref: 'SubscriptionPlan' },
  maxListings: { type: Number, default: 2 }, // Default to free limit (2 listings)
  listingsUsed: { type: Number, default: 0 }
},
{
  timestamps: true 
}
);

export const Vendor = mongoose.model<VendorDocument>('Vendor', vendorSchema);
