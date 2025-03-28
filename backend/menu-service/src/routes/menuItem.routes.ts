import express from 'express';
import { 
  createMenuItemHandler, 
  getMenuItemsByCategoryHandler, 
  updateMenuItemHandler, 
  deleteMenuItemHandler,
  getMenuItemsByRestaurantHandler // Import the new handler
} from '../controllers/menuItem.controller';

const router = express.Router();

router.post('/', createMenuItemHandler); // Create a new menu item
router.get('/category/:categoryId', getMenuItemsByCategoryHandler); // Get menu items by category ID
router.put('/:menuItemId', updateMenuItemHandler); // Update a menu item by ID
router.delete('/:menuItemId', deleteMenuItemHandler); // Delete a menu item by ID
router.get('/restaurant/:restaurantId', getMenuItemsByRestaurantHandler); // Get menu items by restaurant ID

export default router;