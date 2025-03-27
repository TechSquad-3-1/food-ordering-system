import mongoose from 'mongoose';
import Order, { IOrderItem } from '../models/order';
import axios from 'axios';

// Define the structure of a MenuItem returned from the MenuService
interface MenuItem {
  _id: string;
  price: number;
  name: string;
  description: string;
  // Include other fields as per your schema
}

export class OrderService {
  static async createOrder(user_id: string, items: IOrderItem[]) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Fetch menu items from the MenuService (ensure the menu service is accessible)
      const menuItemsResponse = await axios.post<MenuItem[]>('http://menu-service/api/menu-items/batch', {
        menu_item_ids: items.map(item => item.menu_item_id),
      });

      // Get the menu items from the response
      const menuItems = menuItemsResponse.data;

      // Calculate total amount for the order
      const totalAmount = menuItems.reduce((acc: number, item: MenuItem) => {
        const orderedItem = items.find(i => i.menu_item_id.toString() === item._id.toString());
        if (!orderedItem) {
          return acc; // In case we couldn't find a corresponding item
        }
        return acc + item.price * orderedItem.quantity;
      }, 0);

      // Create the order document
      const order = new Order({
        user_id,
        total_amount: totalAmount,
        items: items,
      });

      // Save the order in the database with a session for transaction management
      await order.save({ session });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return order;
    } catch (error) {
      // If something goes wrong, rollback the transaction and throw the error
      await session.abortTransaction();
      session.endSession();

      // It's a good practice to throw an Error with a message that can be caught elsewhere
      if (error instanceof Error) {
        throw new Error(`Order creation failed: ${error.message}`);
      } else {
        throw new Error('Unknown error occurred while creating the order');
      }
    }
  }
}
