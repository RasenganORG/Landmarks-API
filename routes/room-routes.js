'use strict';

const express = require('express');
const {
  addRoomToDB,
  getRoomByID,
  getRoomsForUser,
  updateRoom,
  deleteRoom,
  deleteAllRooms,
} = require('../controllers/roomController');

const router = express.Router();

router.post('/room', addRoomToDB);

router.get('/room/:id', getRoomByID);
router.get('/:userID/rooms/', getRoomsForUser);

router.put('/room/:id', updateRoom);

router.delete('/room/:id', deleteRoom);
router.delete('/rooms', deleteAllRooms);

module.exports = {
  routes: router,
};
