import express from 'express';
import {
  createTrainerDetail,
  deleteTrainer,
  getAllTrainer,
  getTrainerDetail,
  updateTrainer,
} from '../controller/trainerController.js';
import checkRole from '../middleware/authorization.js';
import protectRoute from '../middleware/authentication.js';
const router = express.Router();

router.route('/').get(getAllTrainer);
router.route('/:id').get(protectRoute, checkRole('admin'), getTrainerDetail);
router
  .route('/:id')
  .delete(protectRoute, checkRole('admin'), deleteTrainer)
  .put(protectRoute, checkRole('admin'), updateTrainer)
  .post(createTrainerDetail);

export default router;
