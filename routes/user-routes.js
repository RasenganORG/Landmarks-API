'use strict';

import express from 'express';
import {
  register,
  login,
  logout,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  deleteAllUsers,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

router.get('/users', getAllUsers);
router.get('/user/:id', getUser);

router.put('/user/:id', updateUser);

router.delete('/user/:id', deleteUser);
router.delete('/users', deleteAllUsers);

export default {
  routes: router,
};
