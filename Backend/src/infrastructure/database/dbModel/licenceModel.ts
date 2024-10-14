

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface License extends Document {
  licenseNumber: string;
  email: string;
  issueDate: string;
  expiryDate: string;
  licenseDocumentUrl: string;
}

const LicenseSchema: Schema = new Schema({
  licenseNumber: { type: String, required: true },
  email: { type: String, required: true },
  issueDate: { type: String, required: true },
  expiryDate: { type: String, required: true },
  licenseDocumentUrl: { type: String, required: true },
});

export const LicenseModel: Model<License> = mongoose.model<License>('License', LicenseSchema);
