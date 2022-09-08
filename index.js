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
    origin: ['http://localhost:3000', 'http://localhost:3001'],
  },
});

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/chat', chatRoutes);

let users = [];
const addUser = (userId, socketId) => {
  !users.some((user) => user.id === userId) &&
    users.push({ id: userId, socketId });
};
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.id === userId);
};

io.on('connection', (socket) => {
  //  Connecting
  console.log('A user has connected.');
  // take userId and socketId from user
  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    io.emit('getUsers', users);
  });

  // Send message
  socket.on('sendMessage', ({ sentBy, messageText }) => {
    io.emit('getMessage', { sentBy, messageText });
  });

  // Disconnecting
  socket.on('disconnect', () => {
    console.log('User has disconnected');
    removeUser(socket.id);
    io.emit('getUsers', users);
  });
});

server.listen(config.port, () => {
  console.log(`App is listening on url http://localhost:${config.port}`);
});
