import mongoose, { Schema, Document } from 'mongoose';

export interface IMenuItem extends Document {
  menu_id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_veg: boolean;
  is_available: boolean;
}

const MenuItemSchema: Schema = new Schema(
  {
    menu_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image_url: { type: String, required: true },
    is_veg: { type: Boolean, default: false },
    is_available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);