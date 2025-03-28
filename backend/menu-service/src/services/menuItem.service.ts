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