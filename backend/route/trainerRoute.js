import express from 'express';
import {
  aboutTrainer,
  createTrainerDetail,
  deleteTrainer,
  getAllTrainer,
  getTrainerDetail,
  getTrainerDetails,
  getTrainerTotalRevenue,
  updateTrainer,
} from '../controller/trainerController.js';
import checkRole from '../middleware/authorization.js';
import protectRoute from '../middleware/authentication.js';
import { aboutUpload } from '../middleware/multerAbout.js';

const router = express.Router();

// Get all trainers
router.route('/').get(getAllTrainer);

// Get a specific trainer detail by ID with admin protection
router.route('/:id').get(protectRoute, checkRole('admin'), getTrainerDetail);

// Delete, Update, and Create trainer details with protection and role check
router
  .route('/:id') // Added :id to correctly map with the delete and update routes
  .delete(protectRoute, checkRole('admin'), deleteTrainer) // Added admin role check to delete and update routes
  .put(protectRoute, checkRole('admin'), updateTrainer) // Added admin role check
  .post(protectRoute, checkRole('admin'), createTrainerDetail);

// About section route with file upload for trainers
router
  .route('/about/:id')
  .post(protectRoute, checkRole('trainer'), aboutUpload, aboutTrainer);

// Future edit route for about section (not yet implemented)

router.route('/about/get/detail/:trainerId').get(getTrainerDetails);

router
  .route('/payment/:trainerId')
  .get(protectRoute, checkRole(['trainer', 'admin']), getTrainerTotalRevenue);
export default router;
