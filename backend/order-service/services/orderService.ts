import mongoose from 'mongoose';
import Order, { IOrderItem } from '../models/order';

export class OrderService {
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
    } catch (error) {
      // If something goes wrong, rollback the transaction and throw error
      await session.abortTransaction();
      session.endSession();

      if (error instanceof Error) {
        throw new Error(`Order creation failed: ${error.message}`);
      } else {
        throw new Error('Unknown error occurred while creating the order');
      }
    }
  }
}
