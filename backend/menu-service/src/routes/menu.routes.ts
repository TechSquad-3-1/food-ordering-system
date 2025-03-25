import express from 'express';
import { 
  createMenuHandler, 
  getMenusByRestaurantHandler, 
  updateMenuHandler, 
  deleteMenuHandler 
} from '../controllers/menu.controller';

const router = express.Router();

router.post('/', createMenuHandler); // Create a new menu
router.get('/:restaurantId', getMenusByRestaurantHandler); // Get menus by restaurant ID
router.put('/:menuId', updateMenuHandler); // Update a menu by ID
router.delete('/:menuId', deleteMenuHandler); // Delete a menu by ID

export default router;