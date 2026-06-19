import mongoose from 'mongoose';

export const PROPERTY_TYPES = ['Apartment', 'House', 'Studio'];
export const LISTING_PURPOSES = ['Rent', 'Sale'];

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [4000, 'Description is too long'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    purpose: {
      type: String,
      enum: LISTING_PURPOSES,
      default: 'Rent',
    },
    propertyType: {
      type: String,
      enum: PROPERTY_TYPES,
      required: [true, 'Property type is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    bedrooms: { type: Number, min: 0, default: 1 },
    bathrooms: { type: Number, min: 0, default: 1 },
    images: {
      type: [String],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'At least one image URL is required',
      },
    },
    // Reference linking each listing to the account that authored it.
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Compound index supporting the most common public-feed filters.
propertySchema.index({ city: 1, price: 1 });

export default mongoose.model('Property', propertySchema);
