import MenuModel, { IMenu } from '../models/menu.model';

export const createMenu = async (data: any) => {
  return await MenuModel.create(data);
};

export const getMenusByRestaurant = async (restaurantId: string) => {
  return await MenuModel.find({ restaurant_id: restaurantId, is_active: true });
};
// New Function: Update a Menu
export const updateMenu = async (menuId: string, updatedData: Partial<IMenu>) => {
    return await MenuModel.findByIdAndUpdate(
      menuId,
      { $set: updatedData },
      { new: true } // Return the updated document
    );
  };
  
  // New Function: Delete a Menu
  export const deleteMenu = async (menuId: string) => {
    return await MenuModel.findByIdAndDelete(menuId);
  };
  
// Fetch all menus from all restaurants
export const getAllMenus = async (): Promise<IMenu[]> => {
  try {
    const menus = await MenuModel.find().populate('restaurant_id', 'name'); // Optionally populate restaurant details
    return menus;
  } catch (error) {
    throw error;
  }
};