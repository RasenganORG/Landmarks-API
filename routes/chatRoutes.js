import express from 'express';
import { createChat } from '../controllers/chatController.js';

const router = express.Router();

router.post('/chat', createChat);

// router.get('/room/:id', getRoomByID);

export default router;
