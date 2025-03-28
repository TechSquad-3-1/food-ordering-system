import express from 'express';
import { 
  createMenuItemHandler, 
  getMenuItemsByCategoryHandler, // Updated handler name
  updateMenuItemHandler, 
  deleteMenuItemHandler,
  getMenuItemsByRestaurantHandler 
} from '../controllers/menuItem.controller';

const router = express.Router();

router.post('/', createMenuItemHandler); // Create a new menu item
router.get('/:categoryId', getMenuItemsByCategoryHandler); // Updated route to categoryId
router.put('/:menuItemId', updateMenuItemHandler); // Update a menu item by ID
router.delete('/:menuItemId', deleteMenuItemHandler); // Delete a menu item by ID
router.get('/restaurant/:restaurantId', getMenuItemsByRestaurantHandler); // Get menu items by restaurant ID


export default router;