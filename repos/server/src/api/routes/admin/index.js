import {Router} from 'express';
import categories from './categories';
import variation from './variation';
import products from './products';
import storeCustomize from './storeCustomize';
import orders from './orders';

const router = Router();

router.use(categories);
router.use(variation);
router.use(products);
router.use(storeCustomize);
router.use(orders);

export default router;