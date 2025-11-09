import {Router} from 'express';
import cors from 'cors';
import adminController from './admin';
import userController from './users';
import storeController from './store';
import { adminCorsOptions } from './config';
import express from "express";
import path from "path";

const router = Router();

const openCorsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

router.use('/v1/admin', cors(adminCorsOptions), adminController);
router.use('/v1/users', cors(openCorsOptions), userController);
router.use('/v1/stores', cors(openCorsOptions), storeController);


export default router;