import mongoose from 'mongoose';
import Order, { IOrderItem } from '../models/order';

export class OrderService {
  // Create a new order
  static async createOrder(user_id: string, items: IOrderItem[]) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const totalAmount = items.reduce((acc: number, item) => {
        return acc + item.price * item.quantity;
      }, 0);

      if (totalAmount === 0) {
        throw new Error("No valid menu items found for the order.");
      }

      const order = new Order({
        user_id,
        total_amount: totalAmount,
        items: items,
        status: 'pending' // Set the status to 'pending' initially
      });

      await order.save({ session });

      await session.commitTransaction();
      session.endSession();

      return order;
    } catch (error: unknown) {
      await session.abortTransaction();
      session.endSession();
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred");
    }
  }

  // Get all orders
  static async getAllOrders() {
    return await Order.find();
  }

  // Get an order by its ID
  static async getOrderById(orderId: string) {
    return await Order.findById(orderId);
  }

  // Update an order
  static async updateOrder(orderId: string, user_id: string, items: IOrderItem[], status: string) {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    

    order.user_id = user_id;
    order.items = items;
    order.status = status;
    order.total_amount = items.reduce((acc: number, item) => acc + item.price * item.quantity, 0);

    await order.save();
    return order;
  }

  // Delete an order
  static async deleteOrder(orderId: string) {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status !== 'pending' && order.status !== 'delivered') {
      throw new Error('Order cannot be deleted unless its status is "pending" or "delivered"');
    }

    // Use deleteOne instead of remove
    await order.deleteOne();  // Or use order.delete()

    return order;
  }

  // Get orders by user_id
  static async getOrdersByUserId(userId: string) {
    try {
      const orders = await Order.find({ user_id: userId }); // Find orders by user_id
      return orders;
    } catch (error) {
      throw new Error('Error fetching orders by user ID');
    }
  }
}
