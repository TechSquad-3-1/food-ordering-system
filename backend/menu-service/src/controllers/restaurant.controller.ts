import { Request, Response } from 'express';
import { 
  createRestaurant, 
  getRestaurants, 
  updateRestaurant, 
  deleteRestaurant, 
  getRestaurantById
} from '../services/restaurant.service';

// Create a new restaurant
export const createRestaurantHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurant = await createRestaurant(req.body);
    res.status(201).json(restaurant); // Do not use 'return' here
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// Get all restaurants
export const getRestaurantsHandler = async (_: Request, res: Response): Promise<void> => {
  try {
    const restaurants = await getRestaurants();
    res.status(200).json(restaurants); // Do not use 'return' here
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// Update a restaurant by ID
export const updateRestaurantHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { restaurantId } = req.params;
    const updatedData = req.body;
    const updatedRestaurant = await updateRestaurant(restaurantId, updatedData);

    if (!updatedRestaurant) {
      res.status(404).json({ error: 'Restaurant not found' });
      return; // Use 'return' to exit early
    }

    res.status(200).json(updatedRestaurant); // Do not use 'return' here
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// Delete a restaurant by ID
export const deleteRestaurantHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { restaurantId } = req.params;
    const deletedRestaurant = await deleteRestaurant(restaurantId);

    if (!deletedRestaurant) {
      res.status(404).json({ error: 'Restaurant not found' });
      return; // Use 'return' to exit early
    }

    res.status(200).json({ message: 'Restaurant deleted successfully' }); // Do not use 'return' here
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// Get a single restaurant by ID
export const getRestaurantByIdHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { restaurantId } = req.params; // Extract restaurant ID from URL params
    const restaurant = await getRestaurantById(restaurantId);

    if (!restaurant) {
      res.status(404).json({ error: 'Restaurant not found' });
      return;
    }

    res.status(200).json(restaurant);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};