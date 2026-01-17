import {Router} from 'express';
import payments from './payments';
import orders from './orders';
import store from './store';
import reviews from './reviews';
import newsletter from './newsletter';
import products from './products';

const router = Router();

router.use(store);
router.use(orders);
router.use(reviews);
router.use(newsletter);
router.use(products);
router.use('/payments', payments);

export default router;