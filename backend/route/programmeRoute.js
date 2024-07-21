import express from 'express';
import {
  createProgramme,
  deleteProgramme,
  getAllCategory,
  getByCategoryProgrammes,
  getByTrainer,
  getProgrammes,
  getSingleProgrammeOpen,
  updateProgramme,
} from '../controller/programmeController.js';
import protectRoute from '../middleware/authentication.js';
import checkRole from '../middleware/authorization.js';
import { categoryImageUpload } from '../middleware/categoryMulter.js'; // Correct import for multer middleware

const router = express.Router();

// Create Programme route
router.post(
  '/programme/:id',
  protectRoute,
  categoryImageUpload,
  createProgramme
);

// Get all Programmes route
router.get('/programme', protectRoute, checkRole(['trainer']), getProgrammes);

// Get Programmes by category route
router.get('/programmes', getByCategoryProgrammes);
router.get('/category', getAllCategory);

router.get('/programmes/:id', getSingleProgrammeOpen);

// Get single Programme, Update Programme, and Delete Programme routes
router.route('/trainer/programme').delete(deleteProgramme);

router
  .route('/trainer/programme/:id')
  .get(protectRoute, getByTrainer)
  .put(protectRoute, categoryImageUpload, updateProgramme);

export default router;
