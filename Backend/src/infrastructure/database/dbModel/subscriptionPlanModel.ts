
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface SubscriptionPlan extends Document {
  planName: string;
  price: number;
  features:  string[];
  maxListings: number;
  prioritySupport: 'yes' | 'no';
  status: boolean;
}

const SubscriptionPlanSchema: Schema = new Schema({
  planName: { type: String, required: true },
  price: { type: Number, required: true },
  features: { type:  [String], required: true },
  maxListings: { type: Number, required: true },
  prioritySupport: { type: String, enum: ['yes', 'no'], required: true },
  status: { type: Boolean, default: true }, 
  
});

export const SubscriptionPlanModel: Model<SubscriptionPlan> = mongoose.model<SubscriptionPlan>('SubscriptionPlan', SubscriptionPlanSchema);
