import {Router} from 'express';
import createTicket from './createTicket';

const router = Router();

router.use(createTicket);

export default router;