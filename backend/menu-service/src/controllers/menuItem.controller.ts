import { Request, Response } from 'express';
import { 
  createMenuItem, 
  getMenuItemsByMenu, 
  updateMenuItem,    // Add this import for updating a menu item
  deleteMenuItem     // Add this import for deleting a menu item
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

// Get menu items by category ID (previously menu ID)
export const getMenuItemsByCategoryHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const menuItems = await getMenuItemsByCategory(req.params.categoryId); // Updated param name
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