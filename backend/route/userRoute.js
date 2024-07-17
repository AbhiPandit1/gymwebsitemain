import express from 'express';
import {
  deleteUser,
  getAllUser,
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

//Only for admin
router.route('/admin/user').get(protectRoute, getAllUser);
export default router;
