import { Router } from 'express';
import { handleSearch } from '../controllers/search.controller';

const router = Router();

router.get('/search', handleSearch);

export default router;