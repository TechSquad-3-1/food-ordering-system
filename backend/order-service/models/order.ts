import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  menu_item_id: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  user_id: string;
  total_amount: number;
  status: string;
  items: IOrderItem[];
}

const orderSchema: Schema = new Schema(
  {
    user_id: { type: String, required: true },
    total_amount: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    items: [
      {
        menu_item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', orderSchema);
