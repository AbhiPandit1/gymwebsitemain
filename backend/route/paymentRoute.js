import express from 'express';
import {
  createAccount,
  paymentCheckout,
  paymentDetails,
  refundForPayment,
} from '../controller/paymentController.js';
import protectRoute from '../middleware/authentication.js';
const router = express.Router();

router.route('/checkout/:id').post(protectRoute, paymentCheckout);
router.route('/detail/:id').get(protectRoute, paymentDetails);
router.route('/refund/:paymentIntentId').post(protectRoute, refundForPayment);
router.route('/create/account/:userId').post(protectRoute, createAccount);
export default router;
