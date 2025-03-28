import axios from 'axios';
import RestaurantModel from '../models/restaurant.model';

// Base URL of the Menu Service
const MENU_SERVICE_URL = 'http://localhost:3001';

/**
 * Search across restaurants, categories, and menu items.
 * @param query - The search term to match against names or descriptions.
 * @param location - The location to filter restaurants (optional).
 * @param category - The category name to filter categories (optional).
 * @param cuisine - The cuisine type to filter restaurants (optional).
 * @returns A combined array of matching restaurants, categories, and menu items.
 */
export const searchRestaurants = async (
  query: string,
  location?: string,
  category?: string,
  cuisine?: string
) => {
  const results: any[] = [];

  // Step 1: Search Restaurants
  if (query || location || cuisine) {
    const restaurantQuery: any = {};

    // Build the restaurant query
    if (query) {
      restaurantQuery.$or = [
        { name: { $regex: query, $options: 'i' } }, // Match restaurant name
        { cuisines: { $regex: query, $options: 'i' } }, // Match cuisines
      ];
    }

    if (location) {
      restaurantQuery.location = { $regex: location, $options: 'i' }; // Match location
    }

    if (cuisine) {
      restaurantQuery.cuisines = { $regex: cuisine, $options: 'i' }; // Match cuisine
    }

    // Fetch matching restaurants
    const restaurants = await RestaurantModel.find(restaurantQuery).limit(10);

    // Enrich restaurants with categories and menu items
    const enrichedRestaurants = await Promise.all(
      restaurants.map(async (restaurant) => {
        // Fetch categories for the restaurant
        const categoriesResponse = await axios.get(
          `${MENU_SERVICE_URL}/categories?restaurant_id=${restaurant._id}`
        );
        const categories = categoriesResponse.data;

        // Fetch menu items for the restaurant
        const menuItemsResponse = await axios.get(
          `${MENU_SERVICE_URL}/menu-items?restaurant_id=${restaurant._id}`
        );
        const menuItems = menuItemsResponse.data;

        // Return the enriched restaurant object
        return {
          ...restaurant.toObject(),
          categories,
          menuItems,
        };
      })
    );

    // Add enriched restaurants to the results
    results.push(...enrichedRestaurants);
  }

  // Step 2: Search Categories
  if (category || query) {
    try {
      // Fetch categories matching the query or category name
      const categoriesResponse = await axios.get(
        `${MENU_SERVICE_URL}/categories?name=${query || category}`
      );
      const categories = categoriesResponse.data;

      // Add matching categories to the results
      results.push(...categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  // Step 3: Search Menu Items
  if (query) {
    try {
      // Fetch menu items matching the query
      const menuItemsResponse = await axios.get(
        `${MENU_SERVICE_URL}/menu-items?name=${query}`
      );
      const menuItems = menuItemsResponse.data;

      // Add matching menu items to the results
      results.push(...menuItems);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  }

  // Return the combined results
  return results;
};