import express from 'express';
import { 
  createMenuHandler, 
  getMenusByRestaurantHandler, 
  updateMenuHandler, 
  deleteMenuHandler,
  getAllMenusHandler 
} from '../controllers/menu.controller';

const router = express.Router();

router.post('/', createMenuHandler); // Create a new menu
router.get('/:restaurantId', getMenusByRestaurantHandler); // Get menus by restaurant ID
router.put('/:menuId', updateMenuHandler); // Update a menu by ID
router.delete('/:menuId', deleteMenuHandler); // Delete a menu by ID
router.get('/', getAllMenusHandler); // Get all menus from all restaurants

export default router;