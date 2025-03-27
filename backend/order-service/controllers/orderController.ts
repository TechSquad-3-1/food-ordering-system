import { Request, Response } from 'express';
import { OrderService } from '../services/orderService';

export const createOrder = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { user_id, items } = req.body;

    // Validate input data
    if (!user_id || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Invalid request body, user_id and items are required' });
    }

    // Call OrderService to create the order
    const order = await OrderService.createOrder(user_id, items);

    return res.status(201).json({ order }); // Explicitly return the response
  } catch (error: unknown) {
    // Catching any errors that may occur during order creation
    if (error instanceof Error) {
      return res.status(500).json({ message: 'Error creating order', error: error.message });
    } else {
      return res.status(500).json({ message: 'Unknown error' });
    }
  }
};
