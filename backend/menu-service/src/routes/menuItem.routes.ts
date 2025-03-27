import express from 'express';
import {
  createMenuItemHandler,
  getMenuItemsByMenuHandler,
  updateMenuItemHandler,
  deleteMenuItemHandler,
  getAllMenuItemsHandler, // Import the new handler
} from '../controllers/menuItem.controller';

const router = express.Router();

router.post('/', createMenuItemHandler); // Create a new menu item
router.get('/:menuId', getMenuItemsByMenuHandler); // Get menu items by menu ID
router.put('/:menuItemId', updateMenuItemHandler); // Update a menu item by ID
router.delete('/:menuItemId', deleteMenuItemHandler); // Delete a menu item by ID

// New Route: Get All Menu Items
router.get('/', getAllMenuItemsHandler); // Fetch all menu items

export default router;