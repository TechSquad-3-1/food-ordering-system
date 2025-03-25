import MenuItemModel, { IMenuItem } from '../models/menuItem.model';

export const createMenuItem = async (data: any) => {
  return await MenuItemModel.create(data);
};

export const getMenuItemsByMenu = async (menuId: string) => {
  return await MenuItemModel.find({ menu_id: menuId, is_available: true });
};
// New Function: Update a Menu Item
export const updateMenuItem = async (menuItemId: string, updatedData: Partial<IMenuItem>) => {
    return await MenuItemModel.findByIdAndUpdate(
      menuItemId,
      { $set: updatedData },
      { new: true } // Return the updated document
    );
  };
  
  // New Function: Delete a Menu Item
  export const deleteMenuItem = async (menuItemId: string) => {
    return await MenuItemModel.findByIdAndDelete(menuItemId);
  };