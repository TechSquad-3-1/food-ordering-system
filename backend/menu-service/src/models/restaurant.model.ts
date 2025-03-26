import mongoose, { Schema, Document } from 'mongoose';

export interface IRestaurant extends Document {
  name: string;
  description: string;
  cuisine_type: string;
  address: string;
  contact_number: string;
  image_url: string;
  rating: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const RestaurantSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    cuisine_type: { type: String, required: true },
    address: { type: String, required: true },
    contact_number: { type: String, required: true },
    image_url: { type: String, required: true },
    rating: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);