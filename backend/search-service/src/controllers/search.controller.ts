import { Request, Response } from 'express';
import axios from 'axios';
import RestaurantModel from '../models/restaurant.model';
import { searchMenuItems } from '../services/search.service';

// Base URL of the Menu Service
const MENU_SERVICE_URL = 'http://localhost:3001';

// Handle Restaurant Search
export const handleRestaurantSearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, location, cuisine } = req.query;

    // Validate query parameters
    if (!query && !location && !cuisine) {
      res.status(400).json({ message: 'At least one search parameter is required' });
      return;
    }

    // Build the query object
    const searchQuery: any = {};

    if (query) {
      searchQuery.name = { $regex: query, $options: 'i' }; // Search by restaurant name (case-insensitive)
    }

    if (location) {
      searchQuery['location.tag'] = { $regex: `^${location}$`, $options: 'i' }; // Exact match for location tag
    }

    if (cuisine) {
      searchQuery.cuisines = { $regex: cuisine, $options: 'i' }; // Match cuisine
    }

    // Fetch restaurants with applied filters
    const restaurants = await RestaurantModel.find(searchQuery);

    // If no restaurants found, return empty array
    if (restaurants.length === 0) {
      res.status(404).json({ message: 'No restaurants found' });
      return;
    }

    // Send the response
    res.status(200).json(restaurants);
  } catch (error: any) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const handleMenuItemSearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;

    // Validate query parameter
    if (!query) {
      res.status(400).json({ message: 'Query parameter is required' });
      return; 
    }

    // Call the service to get the filtered menu items
    const filteredMenuItems = await searchMenuItems(query.toString());

    if (filteredMenuItems.length > 0) {
      res.status(200).json(filteredMenuItems);
    } else {
      res.status(404).json({ message: 'No menu items found' });
    }

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Exporting the handleCategorySearch function
export const handleCategorySearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, category } = req.query;

    if (!query && !category) {
      res.status(400).json({ message: 'Query or category parameter is required' });
      return;
    }

    const results: any[] = [];

    try {
      const categoriesResponse = await axios.get(`${MENU_SERVICE_URL}/categories?name=${query || category}`);
      const categories = categoriesResponse.data;

      results.push(...categories);
    } catch (error: unknown) {  // Fix catch block type to `unknown`
      console.error('Error fetching categories:', error);
    }

    if (results.length > 0) {
      res.status(200).json(results);
    } else {
      res.status(404).json({ message: 'No categories found' });
    }
  } catch (error: unknown) {  // Fix catch block type to `unknown`
    if (error instanceof Error) {  // Check if error is an instance of `Error`
      console.error('Error during category search:', error.message);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    } else {
      console.error('Unknown error during category search');
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};
