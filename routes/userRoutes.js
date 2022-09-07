'use strict';

import express from 'express';
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  deleteAllUsers,
} from '../controllers/userController.js';

const router = express.Router();

router.get('/users', getAllUsers);
router.get('/user/:id', getUser);

router.put('/user/:id', updateUser);

router.delete('/user/:id', deleteUser);
router.delete('/users', deleteAllUsers);

export default router;
