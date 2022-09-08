import express from 'express';
import {
  createChat,
  addMessage,
  getMessagesByChatId,
  deleteAllChats,
} from '../controllers/chatController.js';

const router = express.Router();

router.post('/chat', createChat);
router.post('/addMessage', addMessage);

router.get('/:id', getMessagesByChatId);

router.delete('/deleteAll', deleteAllChats);

export default router;
