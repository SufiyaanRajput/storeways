import {Router} from 'express';
import categories from './categories';
import variation from './variation';
import addProduct from './addProduct';
import updateProduct from './updateProduct';
import storeCustomize from './storeCustomize';
import orders from './orders';

const router = Router();

router.use(categories);
router.use(variation);
router.use(addProduct);
router.use(updateProduct);
router.use(storeCustomize);
router.use(orders);

export default router;