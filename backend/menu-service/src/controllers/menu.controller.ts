import { Request, Response } from 'express';
import { 
  createMenu, 
  getMenusByRestaurant, 
  updateMenu, 
  deleteMenu 
} from '../services/menu.service';

// Create a new menu
export const createMenuHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const menu = await createMenu(req.body);
    res.status(201).json(menu);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// Get menus by restaurant ID
export const getMenusByRestaurantHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const menus = await getMenusByRestaurant(req.params.restaurantId);
    res.status(200).json(menus);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// Update a menu by ID
export const updateMenuHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { menuId } = req.params;
    const updatedData = req.body;
    const updatedMenu = await updateMenu(menuId, updatedData);

    if (!updatedMenu) {
       res.status(404).json({ error: 'Menu not found' });
    }

    res.status(200).json(updatedMenu);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// Delete a menu by ID
export const deleteMenuHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { menuId } = req.params;
    const deletedMenu = await deleteMenu(menuId);

    if (!deletedMenu) {
       res.status(404).json({ error: 'Menu not found' });
    }

    res.status(200).json({ message: 'Menu deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};