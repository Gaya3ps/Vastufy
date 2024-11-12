import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the interface for Booking
export interface IBooking extends Document {
  propertyId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  visitDate: Date;
  timeSlot: string;
  createdAt: Date;
  status: 'pending' | 'accepted' | 'rejected';
}

// Define the Booking schema
const BookingSchema: Schema = new Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property', // Reference to the Property model
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor', // Reference to the Vendor model
    required: true,
  },
  visitDate: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
});

// Export the Booking model
export const BookingModel: Model<IBooking> = mongoose.model<IBooking>('Booking', BookingSchema);
