import mongoose, { Schema, Document, Model } from 'mongoose';

// Define an interface for Subcategory document that extends Mongoose's Document
export interface ISubcategory extends Document {
  name: string;
  categoryId: mongoose.Types.ObjectId; // Reference to Category
}

// Define the Subcategory schema
const SubcategorySchema: Schema<ISubcategory> = new Schema<ISubcategory>(
  {
    name: {
      type: String,
      required: [true, 'Subcategory name is required'],
      trim: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId, // Reference to the Category model
      ref: 'Category', // Refers to Category model
      required: [true, 'Category ID is required'],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create and export the Mongoose model for Subcategory
export const Subcategory: Model<ISubcategory> = mongoose.model<ISubcategory>(
  'Subcategory',
  SubcategorySchema
);
