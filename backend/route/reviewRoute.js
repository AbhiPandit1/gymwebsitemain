import express from 'express';
import {
  createReview,
  deleteReview,
  getAllReview,
  getReviewOfSingleTrainer,
  updateReview,
} from '../controller/reviewController.js';

const router = express.Router();

router.route('/create/review/:userId/:trainerId').post(createReview);
router.route('/update/review/:userId/:trainerId').put(updateReview);
router.route('/delete/review/:userId/:trainerId').delete(deleteReview);
router.route('/get/review').get(getAllReview);
router.route('/route/get/:trainerId').all(getReviewOfSingleTrainer);

export default router;
