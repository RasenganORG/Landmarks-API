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

router.get('/', getAllUsers);
router.get('/:id', getUser);

router.put('/update/:id', updateUser);

router.delete('/delete/:id', deleteUser);
router.delete('/deleteAll', deleteAllUsers);

export default router;
