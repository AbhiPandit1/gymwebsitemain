import express from 'express';
import {
  deleteUser,
  getSingleUser,
  postUser,
  updateUser,
} from '../controller/userController.js';
import protectRoute from '../middleware/authentication.js';
import checkRole from '../middleware/authorization.js';

const router = express.Router();

router
  .route('/user/:id')
  .get(protectRoute, checkRole('admin'), getSingleUser)
  .put(protectRoute, checkRole('admin'), updateUser)
  .delete(protectRoute, deleteUser);

//Logg in 'api.user.sigin
router.route('/user/signin').post(postUser);

export default router;
