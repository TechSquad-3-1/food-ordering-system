import mongoose from 'mongoose';
import Order, { IOrderItem } from '../models/order';
import axios from 'axios';

// Define the structure of a MenuItem returned from the MenuService
interface MenuItem {
  _id: string;
  price: number;
  name: string;
  description: string;
  is_available: boolean;
}

export class OrderService {
  static async createOrder(user_id: string, items: IOrderItem[]) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Ensure MENU_SERVICE_URL is correct
      const menuServiceUrl = process.env.MENU_SERVICE_URL || 'http://localhost:3001'; // Menu Service URL

      // Create an array to store the fetched menu items
      const menuItems: MenuItem[] = [];

      // Fetch each menu item from the MenuService individually
      for (const item of items) {
        try {
          // Fetch the menu item from the MenuService using its menu_item_id
          const menuItemResponse = await axios.get<MenuItem>(`${menuServiceUrl}/api/menu-items/${item.menu_item_id}`);
          
          // Check if menuItemResponse.data is valid
          if (!menuItemResponse.data) {
            console.error(`Menu item not found for id: ${item.menu_item_id}`);
            continue; // Skip this item if it's not found
          }

          // Log the fetched menu item for debugging
          console.log(`Fetched menu item: `, menuItemResponse.data);

          // Push the fetched menu item to the menuItems array
          menuItems.push(menuItemResponse.data);
        } catch (err) {
          console.error(`Error fetching menu item with id: ${item.menu_item_id}`, err);
        }
      }

      // Now calculate the total amount
      const totalAmount = menuItems.reduce((acc: number, menuItem: MenuItem) => {
        // Ensure menu_item_id and _id are valid before comparing
        const orderedItem = items.find(i => {
          if (i.menu_item_id && menuItem._id) {
            console.log(`Comparing ${i.menu_item_id} with ${menuItem._id}`);
            return i.menu_item_id.toString() === menuItem._id.toString();
          }
          return false; // Skip if either is undefined or null
        });

        if (!orderedItem) {
          console.error(`No ordered item found for menu item with id: ${menuItem._id}`);
          return acc; // If orderedItem is not found, skip it
        }

        // Add price * quantity to the total amount
        return acc + menuItem.price * orderedItem.quantity;
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
        console.error(`Error creating order: ${error.message}`);
        throw new Error(`Order creation failed: ${error.message}`);
      } else {
        console.error("Unknown error occurred while creating the order");
        throw new Error('Unknown error occurred while creating the order');
      }
    }
  }
}
