'use strict';

const express = require('express');
const {
  addRoomToDB,
  getRoomByID,
  getUserRooms,
  updateRoom,
  deleteRoom,
  deleteAllRooms,
} = require('../controllers/roomController');

const router = express.Router();

router.post('/room', addRoomToDB);

router.get('/room/:id', getRoomByID);
router.get('/:userID/rooms/', getUserRooms);

router.put('/room/:id', updateRoom);

router.delete('/room/:id', deleteRoom);
router.delete('/rooms', deleteAllRooms);

module.exports = {
  routes: router,
};
