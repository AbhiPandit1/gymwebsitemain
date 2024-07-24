import express from 'express';
import {
  deleteTrainerProgrammes,
  deleteUsers,
  getAllPayments,
  getAllTrainerProgrammes,
  getAllUser,
  sendAdvertisment,
} from '../controller/adminController.js';
import protectRoute from '../middleware/authentication.js';
import checkRole from '../middleware/authorization.js';

const router = express.Router();

router.route('/users').get(protectRoute, checkRole('admin'), getAllUser);
router.route('/users/delete/:id').post(deleteUsers);

router
  .route('/programmes')
  .get(protectRoute, checkRole('admin'), getAllTrainerProgrammes);

router
  .route('/delete/programmes')
  .post(protectRoute, checkRole('admin'), deleteTrainerProgrammes);

router
  .route('/payments/detail')
  .get(protectRoute, checkRole('admin'), getAllPayments);

router
  .route('/send/advertisment')
  .post(protectRoute, checkRole('admin'), sendAdvertisment);

export default router;
