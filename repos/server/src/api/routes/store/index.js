import {Router} from 'express';
import fetchProducts from './fechProducts';
import fetchStore from './fetchStore';
import fetchShopFilters from './fechShopFilters';
import payments from './payments';
import orders from './orders';
import reviews from './reviews';
import newsletter from './newsletter';

const router = Router();

router.use(fetchProducts);
router.use(fetchStore);
router.use(fetchShopFilters);
router.use(orders);
router.use(reviews);
router.use(newsletter);
router.use('/payments', payments);

export default router;