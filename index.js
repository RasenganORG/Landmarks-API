'use strict';

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/chat', chatRoutes);

app.listen(config.port, () => {
  console.log(`App is listening on url http://localhost:${config.port}`);
});
