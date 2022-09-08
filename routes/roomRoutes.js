'use strict';

import express from 'express';
import {
  createRoom,
  getRoomByID,
  getRoomsForUser,
  addUserToRoomMembership,
  deleteRoom,
  deleteAllRooms,
} from '../controllers/roomController.js';

const router = express.Router();

router.post('/createRoom', createRoom);

router.get('/:id', getRoomByID);
router.get('/:userID/rooms/', getRoomsForUser);

router.put('/invite/:token', addUserToRoomMembership);

router.delete('/delete/:id', deleteRoom);
router.delete('/deleteAll', deleteAllRooms);

export default router;
