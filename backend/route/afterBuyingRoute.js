import express from 'express';
import { getAllBuyedProgramme } from '../controller/afterBuyingController.js';

const router = express.Router();

router.route('/user/:userId').get(getAllBuyedProgramme);

router.route('/');

export default router;
