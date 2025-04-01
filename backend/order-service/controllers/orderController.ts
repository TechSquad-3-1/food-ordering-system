import { Request, Response } from 'express';
import { OrderService } from '../services/orderService';

// Create order
export const createOrder = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { user_id, items, restaurant_id, delivery_fee, delivery_address } = req.body;

    if (!user_id || !Array.isArray(items) || items.length === 0 || !restaurant_id || delivery_fee === undefined || !delivery_address) {
      return res.status(400).json({ message: 'Invalid request body, user_id, items, restaurant_id, delivery_fee, and delivery_address are required' });
    }

    const order = await OrderService.createOrder(user_id, items, restaurant_id, delivery_fee, delivery_address);
    return res.status(201).json({ order });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: 'Error creating order', error: error.message });
    } else {
      return res.status(500).json({ message: 'Unknown error' });
    }
  }
};


// Get all orders
export const getAllOrders = async (req: Request, res: Response): Promise<Response> => {
  try {
    const orders = await OrderService.getAllOrders();
    return res.status(200).json(orders);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: 'Error retrieving orders', error: error.message });
    } else {
      return res.status(500).json({ message: 'Unknown error' });
    }
  }
};

// Get order by ID
export const getOrderById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const orderId = req.params.orderId;
    const order = await OrderService.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json(order);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: 'Error retrieving order', error: error.message });
    } else {
      return res.status(500).json({ message: 'Unknown error' });
    }
  }
};

// Update Order Handler
export const updateOrder = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { user_id, items, status, restaurant_id, delivery_fee } = req.body;

    if (!user_id || !Array.isArray(items) || items.length === 0 || !restaurant_id) {
      return res.status(400).json({ message: 'Invalid request body, user_id, items, and restaurant_id are required' });
    }

    const updatedOrder = await OrderService.updateOrder(
      req.params.orderId,
      user_id,
      items,
      status,
      restaurant_id,
      delivery_fee
    );
    return res.status(200).json(updatedOrder);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: 'Error updating order', error: error.message });
    } else {
      return res.status(500).json({ message: 'Unknown error' });
    }
  }
};

// Delete Order Handler
export const deleteOrder = async (req: Request, res: Response): Promise<Response> => {
  try {
    const deletedOrder = await OrderService.deleteOrder(req.params.orderId);
    return res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: 'Error deleting order', error: error.message });
    } else {
      return res.status(500).json({ message: 'Unknown error' });
    }
  }
};

// Get orders by user_id handler
export const getOrdersByUserId = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.params.userId;  // Retrieve user_id from URL params
    const orders = await OrderService.getOrdersByUserId(userId);
    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }
    return res.status(200).json(orders);  // Return orders for the user
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: 'Error fetching orders', error: error.message });
    } else {
      return res.status(500).json({ message: 'Unknown error' });
    }
  }
};
