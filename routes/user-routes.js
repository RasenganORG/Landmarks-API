'use strict';

import express from 'express';
import {
  register,
  getAllUsers,
  getUser,
  getLoggedUser,
  updateUser,
  deleteUser,
  deleteAllUsers,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/user', register);

router.get('/users', getAllUsers);
router.get('/user/:id', getUser);
router.get('/getLoggedUser/:email', getLoggedUser);

router.put('/user/:id', updateUser);

router.delete('/user/:id', deleteUser);
router.delete('/users', deleteAllUsers);

export default {
  routes: router,
};
