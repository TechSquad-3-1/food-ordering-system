import { Request, Response } from 'express';
import { searchRestaurants } from '../services/search.service';

export const handleSearch = async (req: Request, res: Response) => {
  try {
    const { query, location, category, cuisine } = req.query;

    const results = await searchRestaurants(
      query as string,
      location as string,
      category as string,
      cuisine as string
    );

    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};