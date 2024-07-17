import express from 'express';
import {
  forgotPasswordController,
  resetPasswordController,
} from '../controller/forgotPasswordController.js';

const router = express.Router();

router.route('/password').post(forgotPasswordController);
router.route('/reset/password/:token').put(resetPasswordController);

export default router;
