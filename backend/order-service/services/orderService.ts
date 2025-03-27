import mongoose from 'mongoose';
import Order, { IOrderItem } from '../models/order';

export class OrderService {
  // Create a new order
  static async createOrder(user_id: string, items: IOrderItem[]) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Calculate total amount based on the provided items' prices and quantities
      const totalAmount = items.reduce((acc: number, item) => {
        return acc + item.price * item.quantity; // Multiply price by quantity
      }, 0);

      // Check if we have any valid items to process, and if not, throw an error
      if (totalAmount === 0) {
        throw new Error("No valid menu items found for the order.");
      }

      // Create the order document
      const order = new Order({
        user_id,
        total_amount: totalAmount,
        items: items,
      });

      // Save the order in the database
      await order.save({ session });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return order;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
        throw error;
      } else {
        console.error("Unknown error occurred");
        throw new Error("Unknown error occurred");
      }
    }
  }

  // Get all orders
  static async getAllOrders() {
    return await Order.find(); // Retrieve all orders
  }

  // Get an order by its ID
  static async getOrderById(orderId: string) {
    return await Order.findById(orderId); // Retrieve the order by _id
  }

  // Update an order
  static async updateOrder(orderId: string, user_id: string, items: IOrderItem[], status: string) {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    // Update the order's fields
    order.user_id = user_id;
    order.items = items;
    order.status = status;
    order.total_amount = items.reduce((acc: number, item) => acc + item.price * item.quantity, 0);

    await order.save();
    return order; // Return updated order
  }

  // Delete an order
  static async deleteOrder(orderId: string) {
    const order = await Order.findByIdAndDelete(orderId);
    return order; // Return the deleted order
  }
}
