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

router.post('/room', createRoom);

router.get('/room/:id', getRoomByID);
router.get('/:userID/rooms/', getRoomsForUser);

router.put('/room/:token', addUserToRoomMembership);

router.delete('/room/:id', deleteRoom);
router.delete('/rooms', deleteAllRooms);

export default {
  routes: router,
};
