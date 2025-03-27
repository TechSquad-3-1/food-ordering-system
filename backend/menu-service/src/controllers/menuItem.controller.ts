import { Request, Response } from 'express';
import { 
  createMenuItem, 
  getMenuItemsByMenu, 
  updateMenuItem,    // Add this import for updating a menu item
  deleteMenuItem,     // Add this import for deleting a menu item
  getAllMenuItems
} from '../services/menuItem.service';

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

export const getMenuItemsByMenuHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const menuItems = await getMenuItemsByMenu(req.params.menuId);
    res.status(200).json(menuItems);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// New Handler: Update a Menu Item
export const updateMenuItemHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { menuItemId } = req.params; // Extract menu item ID from URL params
    const updatedData = req.body;     // Extract updated data from request body
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

// New Handler: Delete a Menu Item
export const deleteMenuItemHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { menuItemId } = req.params; // Extract menu item ID from URL params
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

// New Handler: Get All Menu Items
export const getAllMenuItemsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const menuItems = await getAllMenuItems(); // Call the service function
    res.status(200).json(menuItems);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};