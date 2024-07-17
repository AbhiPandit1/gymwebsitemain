// Importing necessary modules
import express from 'express';
import { signIn, signOut } from '../controller/userAuthController.js';

// Creating an instance of Express Router
const router = express.Router();

// Defining routes for '/signin' and '/signout'
router.route('/signin').post(signIn);
router.route('/signout').post(signOut);

// Exporting the router instance
export default router;
