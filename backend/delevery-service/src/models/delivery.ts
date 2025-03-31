import mongoose, { Document, Schema } from "mongoose";

export interface IDelivery extends Document {
  orderId: string;
  customerName: string;
  deliveryAddress: string;
  restaurantName: string;
  deliveryStatus: string;
  pickupTime: Date;
  deliveryTime: Date;
}

const deliverySchema: Schema = new Schema(
  {
    orderId: { type: String, required: true },
    customerName: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    restaurantName: { type: String, required: true },
    deliveryStatus: { type: String, default: "pending" },
    pickupTime: { type: Date, required: true },
    deliveryTime: { type: Date, required: true },
  },
  { timestamps: true }
);

const Delivery = mongoose.model<IDelivery>("Delivery", deliverySchema);

export default Delivery;
