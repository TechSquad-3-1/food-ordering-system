import { Request, Response } from 'express';
import { 
  createMenuItem, 
  getMenuItemsByCategory, // Updated function name
  updateMenuItem, 
  deleteMenuItem, 
  getMenuItemsByRestaurant,
  getAllMenuItems
} from '../services/menuItem.service';

// Create a new menu item (now associated with a category)
export const createMenuItemHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const menuItem = await createMenuItem(req.body);
    res.status(201).json(menuItem);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// Get menu items by category ID
export const getMenuItemsByCategoryHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoryId } = req.params; // Extract category ID from URL params
    const menuItems = await getMenuItemsByCategory(categoryId);

    res.status(200).json(menuItems);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// Update a menu item by ID
export const updateMenuItemHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { menuItemId } = req.params;
    const updatedData = req.body;
    const updatedMenuItem = await updateMenuItem(menuItemId, updatedData);

    if (!updatedMenuItem) {
       res.status(404).json({ error: 'Menu item not found' });
    }

    res.status(200).json(updatedMenuItem);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// Delete a menu item by ID
export const deleteMenuItemHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { menuItemId } = req.params;
    const deletedMenuItem = await deleteMenuItem(menuItemId);

    if (!deletedMenuItem) {
       res.status(404).json({ error: 'Menu item not found' });
    }

    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// Get all menu items for a specific restaurant
export const getMenuItemsByRestaurantHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { restaurantId } = req.params; // Extract restaurant ID from URL params
    const menuItems = await getMenuItemsByRestaurant(restaurantId);

    res.status(200).json(menuItems);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// Get all menu items from all restaurants
export const getAllMenuItemsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const menuItems = await getAllMenuItems();
    res.status(200).json(menuItems);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};