import mongoose, { Schema, Document } from 'mongoose';

export interface IRestaurant extends Document {
  id: string; // Maps to MongoDB's `_id`
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  minOrder: string;
  distance: string;
  cuisines: string[];
  priceLevel: number;
  is_active: boolean;
}

const RestaurantSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    rating: { type: Number, default: 0 },
    deliveryTime: { type: String, required: true },
    deliveryFee: { type: String, required: true },
    minOrder: { type: String, required: true },
    distance: { type: String, required: true },
    cuisines: { type: [String], required: true },
    priceLevel: { type: Number, required: true },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);