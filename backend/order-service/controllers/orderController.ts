// controllers/orderController.ts

import { Request, Response } from 'express';
import { OrderService } from '../services/orderService';

// Create order
export const createOrder = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { user_id, items } = req.body;

    if (!user_id || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Invalid request body, user_id and items are required' });
    }

    const order = await OrderService.createOrder(user_id, items);
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

// Update order
export const updateOrder = async (req: Request, res: Response): Promise<Response> => {
  try {
    const orderId = req.params.orderId;
    const { user_id, items, status } = req.body;

    if (!user_id || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Invalid request body, user_id and items are required' });
    }

    const order = await OrderService.updateOrder(orderId, user_id, items, status);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json(order);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: 'Error updating order', error: error.message });
    } else {
      return res.status(500).json({ message: 'Unknown error' });
    }
  }
};

// Delete order
export const deleteOrder = async (req: Request, res: Response): Promise<Response> => {
  try {
    const orderId = req.params.orderId;
    const deletedOrder = await OrderService.deleteOrder(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: 'Error deleting order', error: error.message });
    } else {
      return res.status(500).json({ message: 'Unknown error' });
    }
  }
};
