import express from 'express';
import {
  paymentCheckout,
  paymentDetails,
  refundForPayment,
} from '../controller/paymentController.js';
import protectRoute from '../middleware/authentication.js';
const router = express.Router();

router.route('/checkout/:id').post(protectRoute, paymentCheckout);
router.route('/detail/:id').get(protectRoute, paymentDetails);
router.route('/refund/:paymentIntentId').post(protectRoute, refundForPayment);

export default router;
