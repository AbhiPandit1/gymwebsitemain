import express from 'express';
import {
  createProgrammeDietPlan,
  getProgrammeDietPlan,
  getSingleProgrammeDietPlan,
  updateProgrammeDietPlan,
  deleteProgrammeDietPlan,
} from '../controller/programmeDietController.js';

const router = express.Router();

router.post('/diet/plan/:id', createProgrammeDietPlan);

router.get('/diet/plan/:id', getProgrammeDietPlan);

router.get('/diet/plan/:id/:planId', getSingleProgrammeDietPlan);

router.put('/diet/plan/:id/:planId', updateProgrammeDietPlan);

router.delete('/diet/plan/:id/:planId', deleteProgrammeDietPlan);

export default router;
