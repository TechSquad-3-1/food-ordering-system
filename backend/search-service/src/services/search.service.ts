import RestaurantModel from '../models/restaurant.model';

export const searchRestaurants = async (
  query: string,
  location?: string,
  category?: string,
  cuisine?: string
) => {
  const searchQuery: any = {};

  if (query) {
    searchQuery.$or = [
      { name: { $regex: query, $options: 'i' } },
      { 'menuItems.name': { $regex: query, $options: 'i' } },
    ];
  }

  if (location) {
    searchQuery.location = { $regex: location, $options: 'i' };
  }

  if (category) {
    searchQuery.categories = category;
  }

  if (cuisine) {
    searchQuery.cuisines = cuisine;
  }

  const results = await RestaurantModel.find(searchQuery).limit(10);
  return results;
};