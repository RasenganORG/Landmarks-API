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

const users = [];

const userJoin = (id, room, socketId, name) => {
  const user = { id, room, socketId, name };
  !users.some(
    (user) => user.id === id && user.room === room && user.name === name
  ) && users.push(user);
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

const getRoomUsers = (room) => {
  return users.filter((user) => user.room === room);
};

const messageFormat = (messageText, sentBy) => {
  const message = { messageText, sentBy, timestamp: new Date().toUTCString() };
  return message;
};

const botName = 'BOT';

io.on('connection', (socket) => {
  //  Connecting
  console.log('A user has connected.');
  // Join room
  socket.on('joinRoom', ({ id, chatID, name }) => {
    const user = userJoin(id, chatID, socket.id, name);
    console.log(user);

    socket.join(user.room, () => {
      // socket.emit('getMessage', messageFormat('Welcome to Landmarks', botName));
      // socket.broadcast
      //   .to(user.room)
      //   .emit('sendMessage', messageFormat(`${user.name} has joined the chat.`, botName));
      // Send user and room info

      io.to(user.room).emit('getUserRooms', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
      // socket.on('sendUserRooms', () => {
      //   const user = getCurrentUser(socket.id);
      //   console.log(user);
      // });
    });
  });

  // Send message
  socket.on('sendMessage', ({ sentBy, messageText }) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('getMessage', messageFormat(messageText, user.id));
  });

  // Disconnecting
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'sendMessage',
        messageFormat(`${user.name} left the chat.`, user.id)
      );
      io.to(user.room).emit('getUserRooms', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }

    console.log('User has disconnected');
  });
});

server.listen(config.port, () => {
  console.log(`App is listening on url http://localhost:${config.port}`);
});
