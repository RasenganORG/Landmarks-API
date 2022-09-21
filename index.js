'use strict';

import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
    ],
  },
});

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/chat', chatRoutes);

const users = [];

const userJoin = (id, chatId, socketId, name) => {
  const user = { id, chatId, socketId, name };
  !users.some((user) => user.socketId === socketId && user.chatId === chatId) &&
    users.push(user);
  return user;
};

const getCurrentUser = (socketId) => {
  return users.find((user) => user.socketId === socketId);
};

const userLeave = (socketId) => {
  const index = users.findIndex((user) => user.socketId === socketId);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getRoomUsers = (chatId) => {
  return users.filter((user) => user.chatId === chatId);
};

const messageFormat = (messageText, sentBy, chatId) => {
  const message = {
    messageText,
    sentBy,
    timestamp: new Date().toUTCString(),
    chatId,
  };
  return message;
};

const botName = 'BOT';

//  Connecting
io.on('connection', async (socket) => {
  // Join room
  socket.on('joinRoom', async ({ id, chatId, name }) => {
    const user = userJoin(id, chatId, socket.id, name);
    console.log(`User ${name} - ${socket.id} joined chat ${chatId}`);
    await socket.join(user.chatId);

    // Send user and room info
    io.to(user.chatId).emit('getUserRooms', {
      chatId: user.chatId,
      users: getRoomUsers(user.chatId),
    });
  });

  // Send message
  socket.on('sendMessage', ({ chatId, messageText }) => {
    const user = getCurrentUser(socket.id);
    console.log(socket.id);
    socket
      .to(chatId)
      .emit('getMessage', messageFormat(messageText, user.id, chatId));
  });

  // Disconnecting
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    console.log('User has disconnected');
  });
});

server.listen(config.port, () => {
  console.log(`App is listening on url http://localhost:${config.port}`);
});
