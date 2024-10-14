import mongoose, { Schema, Document, Model } from 'mongoose';

// Define an interface for Category document that extends Mongoose's Document
export interface ICategory extends Document {
  name: string;
  description?: string;
}

// Define the Category schema
const CategorySchema: Schema = new Schema<ICategory>({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true, 
    trim: true,  
  },
  description: {
    type: String,
    trim: true,  
  },
}, {
  timestamps: true, 
});

// Create and export the Mongoose model for Category
export const Category: Model<ICategory> = mongoose.model<ICategory>('Category', CategorySchema);
