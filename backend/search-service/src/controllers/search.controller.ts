import { Request, Response } from 'express';
import axios from 'axios';

// Base URL of the Menu Service
const MENU_SERVICE_URL = 'http://localhost:3001';

// Handle Restaurant Search
export const handleRestaurantSearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, location, cuisine } = req.query;

    // Validate query parameters
    if (!query && !location && !cuisine) {
      res.status(400).json({ message: 'At least one search parameter is required' });
    }

    // Fetch restaurants
    const response = await axios.get(`${MENU_SERVICE_URL}/api/restaurants`, {
      params: { query, location, cuisine },
    });

    // Send the response
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Handle Category Search
export const handleCategorySearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;

    // Validate query parameter
    if (!query) {
      res.status(400).json({ message: 'Query parameter is required' });
    }

    // Fetch categories
    const response = await axios.get(`${MENU_SERVICE_URL}/api/category`, {
      params: { query },
    });

    // Send the response
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Handle Menu Item Search
export const handleMenuItemSearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;

    // Validate query parameter
    if (!query) {
       res.status(400).json({ message: 'Query parameter is required' });
    }

    // Fetch menu items
    const response = await axios.get(`${MENU_SERVICE_URL}/api/menu-items`, {
      params: { query },
    });

    // Send the response
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};