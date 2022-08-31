'use strict';

const express = require('express');
const {
  createRoom,
  getRoomByID,
  getRoomsForUser,
  addUserToRoomMembership,
  deleteRoom,
  deleteAllRooms,
} = require('../controllers/roomController');

const router = express.Router();

router.post('/room', createRoom);

router.get('/room/:id', getRoomByID);
router.get('/:userID/rooms/', getRoomsForUser);

router.put('/room/:token', addUserToRoomMembership);

router.delete('/room/:id', deleteRoom);
router.delete('/rooms', deleteAllRooms);

module.exports = {
  routes: router,
};
