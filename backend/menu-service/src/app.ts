import express from 'express';
import restaurantRoutes from './routes/restaurant.routes';
import menuRoutes from './routes/menu.routes';
import menuItemRoutes from './routes/menuItem.routes';

const app = express();

app.use(express.json());

app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/menu-items', menuItemRoutes);

export default app;