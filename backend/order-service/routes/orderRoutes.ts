import express, { Request, Response } from 'express';
import { createOrder } from '../controllers/orderController';

const router = express.Router();

// Define the route with an explicit type for async handler
router.post('/orders', async (req: Request, res: Response) => {
  try {
    await createOrder(req, res);  // Call the async handler function
  } catch (error: unknown) {
    // Type assertion to check if it's an instance of Error
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error creating order', error: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error occurred' });
    }
  }
});

export default router;
