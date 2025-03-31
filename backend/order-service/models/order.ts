import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  menu_item_id: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  order_id: string; // Added order_id
  user_id: string;
  total_amount: number;
  status: string;
  items: IOrderItem[];
  restaurant_id: string;
}

const orderSchema: Schema = new Schema(
  {
    order_id: { type: String, required: true, unique: true }, // Custom order_id field
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
    restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  },
  { timestamps: true }
);

// Auto-generate the `order_id` before saving the order
orderSchema.pre('save', async function (next) {
  if (!this.order_id) {
    const count = await mongoose.model('Order').countDocuments();
    this.order_id = `ORD${(count + 1).toString().padStart(3, '0')}`; // Generate order_id like ORD001, ORD002, etc.
  }
  next();
});

export default mongoose.model<IOrder>('Order', orderSchema);
