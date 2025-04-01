import mongoose from 'mongoose';
import Order, { IOrderItem } from '../models/order';

export class OrderService {
  // Create a new order
  static async createOrder(user_id: string, items: IOrderItem[], restaurant_id: string, delivery_fee: number, delivery_address: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const totalAmount = items.reduce((acc: number, item) => {
        return acc + item.price * item.quantity;
      }, 0);

      // Include delivery fee in the total amount
      const totalAmountWithDeliveryFee = totalAmount + delivery_fee;

      if (totalAmount === 0) {
        throw new Error("No valid menu items found for the order.");
      }

      // Generate custom order_id (e.g., ORD001, ORD002, etc.)
      const orderCount = await Order.countDocuments();
      const orderId = `ORD${(orderCount + 1).toString().padStart(3, '0')}`;

      const order = new Order({
        order_id: orderId,
        user_id,
        total_amount: totalAmountWithDeliveryFee, // Updated total_amount with delivery fee
        items: items,
        status: 'pending',
        restaurant_id: restaurant_id,
        delivery_fee: delivery_fee, // Set the delivery fee
        delivery_address: delivery_address, // Set the delivery address
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

  // Get an order by its ID (either Mongo ObjectId or custom order_id)
  static async getOrderById(orderId: string) {
    let order;

    // Check if the orderId is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(orderId)) {
      // If it is a valid ObjectId, search by _id
      order = await Order.findById(orderId);
    } else {
      // If it is not a valid ObjectId, search by order_id (the custom string)
      order = await Order.findOne({ order_id: orderId });
    }

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  // Update an order
  static async updateOrder(orderId: string, user_id: string, items: IOrderItem[], status: string, restaurant_id: string, delivery_fee: number) {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    order.user_id = user_id;
    order.items = items;
    order.status = status;
    order.restaurant_id = restaurant_id;
    
    // Recalculate total_amount including delivery fee
    const totalAmount = items.reduce((acc: number, item) => acc + item.price * item.quantity, 0);
    order.total_amount = totalAmount + delivery_fee; // Add delivery fee to the total amount
    order.delivery_fee = delivery_fee; // Update delivery fee

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

  // Get orders by restaurant_id
  static async getOrdersByRestaurantId(restaurantId: string) {
    try {
      const orders = await Order.find({ restaurant_id: restaurantId }); // Find orders by restaurant_id
      return orders;
    } catch (error) {
      throw new Error('Error fetching orders by restaurant ID');
    }
  }
}
