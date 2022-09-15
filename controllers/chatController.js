'use strict';

import { firebaseAdmin } from '../firebase.js';
import { FieldValue } from 'firebase-admin/firestore';
import deleteCollection from '../helpers/deleteCollection.js';

const firestore = firebaseAdmin.firestore();

const createChat = async (req, res, next) => {
  try {
  } catch (error) {
    res.status(404).send(error.message);
    console.log(error);
  }
};

const addMessage = async (req, res, next) => {
  try {
    const { chatId, message } = req.body;
    const chatsCollection = firestore.collection('chats');
    await chatsCollection.doc(chatId).update({
      messages: FieldValue.arrayUnion(message),
    });
    const chatRef = await chatsCollection.doc(chatId).get();
    res.status(200).send(chatRef.data());
  } catch (error) {}
};

const getMessagesByChatId = async (req, res, next) => {
  try {
    const id = req.params.id;
    const chatsCollection = firestore.collection('chats');
    const chatRef = await chatsCollection.doc(id).get();
    if (chatRef.exists && chatRef.data().messages) {
      const orderedMessages = chatRef
        .data()
        .messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      res.status(200).send(orderedMessages);
    } else {
      throw new Error('No messages');
    }
  } catch (error) {
    res.status(404).send(error.message);
    console.log(error);
  }
};

const deleteAllChats = async (req, res, next) => {
  try {
    const isEmpty = await deleteCollection(firestore, 'chats', 3);
    if (isEmpty) res.status(202).send('All chats have been deleted');
  } catch (error) {
    res.status(404).send(error.message);
    console.log(error);
  }
};

export { createChat, addMessage, getMessagesByChatId, deleteAllChats };
