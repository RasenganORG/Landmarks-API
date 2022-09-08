import express from 'express';
import {
  createChat,
  addMessage,
  getMessages,
} from '../controllers/chatController.js';

const router = express.Router();

router.post('/chat', createChat);
router.post('/addMessage', addMessage);

router.get('/:id', getMessages);

export default router;
