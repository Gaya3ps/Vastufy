import mongoose, { Document, Schema } from 'mongoose';


export interface Iuser extends Document {
  name?: string;
  email: string;
  mobileNumber: number;
  password?: string;
  favorites?: string[];
  is_verified?: boolean;
  is_blocked?:boolean;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  createdAt: Date; 
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: Number }, 
  password: { type: String, required: true },
  favorites: { type: [String], default: [] },
  is_verified: { type: Boolean, default:false },
  is_google: { type: Boolean, default:false },
  is_blocked: { type: Boolean, default:false },
  resetPasswordToken: { type: String, default: null },  
  resetPasswordExpires: { type: Date, default: null }        
},
{
  timestamps: true, 
}
);

export const Users =  mongoose.model<Iuser>('User', UserSchema);
