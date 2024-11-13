import mongoose, { Schema, Document, Types } from 'mongoose';

export interface VendorSubscriptionDocument extends Document {
  vendor: Types.ObjectId;
  subscription: Types.ObjectId;
  purchaseDate: Date;
  stripe_session_id:string;
}

const VendorSubscriptionSchema: Schema = new Schema<VendorSubscriptionDocument>({
  vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  subscription: { type: Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true },
  purchaseDate: { type: Date, default: Date.now },
  stripe_session_id:{type:String},
});

export const VendorSubscription = mongoose.model<VendorSubscriptionDocument>('VendorSubscription', VendorSubscriptionSchema);
