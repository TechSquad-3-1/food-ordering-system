import { Request, Response } from 'express';
import { OrderService } from '../services/orderService';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { user_id, items } = req.body;

    const order = await OrderService.createOrder(user_id, items);
    res.status(201).json({ order });
} catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error creating order', error: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    }
  }
  
};
