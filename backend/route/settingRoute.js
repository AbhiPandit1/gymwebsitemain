import express from 'express';
import {
  changeEmail,
  changePassword,
  changeSocialMedia,
  complain,
  submitReview,
} from '../controller/settingController.js';
import protectRoute from '../middleware/authentication.js';

const router = express.Router();

router.route('/password/change/:id').put(protectRoute, changePassword);
router.route('/email/change/:id').put(protectRoute, changeEmail);
router.route('/socialmedia/change/:id').post(protectRoute, changeSocialMedia);
router.route('/complain/:id').post(protectRoute, complain);
router.route('/review/:id').post(protectRoute, submitReview);

export default router;
