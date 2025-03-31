import RestaurantModel, { IRestaurant } from '../models/restaurant.model';
import CategoryModel from '../models/category.model';
import MenuItemModel from '../models/menuItem.model';

export const createRestaurant = async (data: any) => {
  return await RestaurantModel.create(data);
};

export const getRestaurants = async () => {
  return await RestaurantModel.find({ is_active: true });
};
// New Function: Update a Restaurant
export const updateRestaurant = async (restaurantId: string, updatedData: Partial<IRestaurant>) => {
    return await RestaurantModel.findByIdAndUpdate(
      restaurantId,
      { $set: updatedData },
      { new: true } // Return the updated document
    );
  };
  
  // New Function: Delete a Restaurant
  export const deleteRestaurant = async (restaurantId: string) => {
    return await RestaurantModel.findByIdAndDelete(restaurantId);
  };

  // Fetch a single restaurant by ID
export const getRestaurantById = async (restaurantId: string): Promise<IRestaurant | null> => {
  try {
    const restaurant = await RestaurantModel.findById(restaurantId);
    return restaurant;
  } catch (error) {
    throw error;
  }
};

// Fetch restaurant details including categories and menu items
export const getRestaurantWithCategoriesAndMenuItems = async (restaurantId: string) => {
  try {
    // Step 1: Find all categories associated with the restaurant
    const categories = await CategoryModel.find({ restaurant_id: restaurantId, is_active: true });

    // Step 2: Extract category IDs
    const categoryIds = categories.map((category) => category._id);

    // Step 3: Find all menu items associated with the category IDs
    const menuItems = await MenuItemModel.find({
      category_id: { $in: categoryIds },
      is_available: true,
    });

    // Step 4: Return the combined result
    return {
      categories,
      menuItems,
    };
  } catch (error) {
    throw error;
  }
};