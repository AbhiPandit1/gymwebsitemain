import express from 'express';
import { createUserDetail } from '../controller/userDetailController.js';
import protectRoute from '../middleware/authentication.js';
import singleUpload from '../middleware/multer.js';

const router = express.Router();

router.route('/user/detail/:id').put(singleUpload, createUserDetail); // Route for handling user detail creation/update

export default router;
