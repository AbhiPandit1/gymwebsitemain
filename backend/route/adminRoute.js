import express from 'express';
import { deleteUsers, getAllUser } from '../controller/adminController.js';
import protectRoute from '../middleware/authentication.js';

const router = express.Router();

router.route('/users').get(protectRoute, getAllUser);
router.route('/users/delete/:id').post(deleteUsers);

export default router;
