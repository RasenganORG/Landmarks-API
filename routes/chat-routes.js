import express from 'express';
import {} from '../controllers/chatController.js';

const router = express.Router();

router.post('/room', createRoom);

router.get('/room/:id', getRoomByID);

export default {
  routes: router,
};
