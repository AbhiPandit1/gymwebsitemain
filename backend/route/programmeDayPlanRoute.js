import express from 'express';
import multer from 'multer'; // Ensure multer is installed
import {
  createProgrammeDayPlan,
  deleteProgrammeDayPlan,
  getProgrammeDayPlan,
  getSingleProgrammeDayPlan,
  updateProgrammeDayPlan,
} from '../controller/programmeDayController.js';

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Configure multer to store files in 'uploads/' directory

const router = express.Router();

// Route to create a day plan
router.post(
  '/programme/:id/day/plan',
  upload.fields([{ name: 'videoFiles', maxCount: 10 }]),
  createProgrammeDayPlan
);

// Route to update a specific day plan
router.put(
  '/programme/:id/day/plan/:planId',

  updateProgrammeDayPlan
);

// Route to get all day plans for a programme
router.get('/programme/:id/day/plans', getProgrammeDayPlan);
router.get('/programme/:id/:planId/day/plans', getSingleProgrammeDayPlan);

// Route to delete a specific day plan
router.delete('/programme/:id/dayplan/:planId', deleteProgrammeDayPlan);

export default router;
