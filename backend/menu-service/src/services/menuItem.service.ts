import MenuItemModel, { IMenuItem } from '../models/menuItem.model'; // Import remains the same
import CategoryModel from '../models/category.model';

export const createMenuItem = async (data: any) => {
  return await MenuItemModel.create(data);
};

export const getMenuItemsByCategory = async (categoryId: string) => {
  return await MenuItemModel.find({ category_id: categoryId, is_available: true }); // Changed query to category_id
};

// Update a menu item
export const updateMenuItem = async (menuItemId: string, updatedData: Partial<IMenuItem>) => {
    return await MenuItemModel.findByIdAndUpdate(
      menuItemId,
      { $set: updatedData },
      { new: true } // Return the updated document
    );
  };
  
  // Delete a menu item
  export const deleteMenuItem = async (menuItemId: string) => {
    return await MenuItemModel.findByIdAndDelete(menuItemId);
  };

  // Fetch all menu items for a specific restaurant
export const getMenuItemsByRestaurant = async (restaurantId: string): Promise<IMenuItem[]> => {
  try {
    // Find categories associated with the restaurant
    const categories = await CategoryModel.find({ restaurant_id: restaurantId });

    // Extract category IDs
    const categoryIds = categories.map((category) => category._id);

    // Find menu items associated with the category IDs
    const menuItems = await MenuItemModel.find({ category_id: { $in: categoryIds }, is_available: true });

    return menuItems;
  } catch (error) {
    throw error;
  }
};