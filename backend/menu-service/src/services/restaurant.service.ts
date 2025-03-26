import RestaurantModel, { IRestaurant } from '../models/restaurant.model';

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