import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  menu_item_id: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  order_id: string;
  user_id: string;
  total_amount: number;
  status: string;
  items: IOrderItem[];
  restaurant_id: string;
  delivery_fee: number;
  delivery_address: string;
  phone: string; // Added phone field
  email: string; // Added email field
  payment_method: string; // Added payment method field
  order_date: Date; // Added order date field
}

const orderSchema: Schema = new Schema(
  {
    order_id: { type: String, required: true, unique: true },
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
    delivery_fee: { type: Number, default: 0 },
    delivery_address: { type: String, required: true },
    phone: { type: String, required: true }, // Added phone field
    email: { type: String, required: true }, // Added email field
    payment_method: { type: String, required: true }, // Added payment method
    order_date: { type: Date, default: Date.now }, // Added order date field
  },
  { timestamps: true }
);

// Auto-generate the `order_id` before saving the order
orderSchema.pre('save', async function (next) {
  if (!this.order_id) {
    const count = await mongoose.model('Order').countDocuments();
    this.order_id = `ORD${(count + 1).toString().padStart(3, '0')}`;
  }
  next();
});

export default mongoose.model<IOrder>('Order', orderSchema);
