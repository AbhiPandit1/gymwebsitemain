import express from 'express';
import {
  createReview,
  deleteReview,
  getAllReview,
  getReviewsOfSingleTrainer,
  updateReview,
} from '../controller/reviewController.js';

const router = express.Router();

router.route('/create/review/:userId').post(createReview);
router.route('/update/review/:reviewId').put(updateReview);
router.route('/delete/review/:userId').delete(deleteReview);
router.route('/get/review').get(getAllReview);
router.route('/review/trainer/:trainerId').all(getReviewsOfSingleTrainer);

export default router;
