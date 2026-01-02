import {Router} from 'express';
import categories from './categories';
import variation from './variation';
import products from './products';
import stores from './stores';
import orders from './orders';

const router = Router();

router.use(categories);
router.use(variation);
router.use(products);
router.use(stores);
router.use(orders);

export default router;