import express from 'express';
import { 
  createRestaurantHandler, 
  getRestaurantsHandler, 
  updateRestaurantHandler, // Import the new handler
  deleteRestaurantHandler,  // Import the new handler
  getRestaurantByIdHandler
} from '../controllers/restaurant.controller';

const router = express.Router();

router.post('/', createRestaurantHandler); // Create a new restaurant
router.get('/', getRestaurantsHandler);   // Get all restaurants
router.put('/:restaurantId', updateRestaurantHandler); // Update a restaurant by ID
router.delete('/:restaurantId', deleteRestaurantHandler); // Delete a restaurant by ID
router.get('/:restaurantId', getRestaurantByIdHandler); // Get a single restaurant by ID

export default router;