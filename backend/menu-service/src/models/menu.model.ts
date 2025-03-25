import mongoose, { Schema, Document } from 'mongoose';

export interface IMenu extends Document {
  restaurant_id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  image_url: string;
  is_active: boolean;
  category: string;
}

const MenuSchema: Schema = new Schema(
  {
    restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    image_url: { type: String, required: true },
    is_active: { type: Boolean, default: true },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IMenu>('Menu', MenuSchema);