'use strict';

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config.js';
import userRoutes from './routes/user-routes.js';
import roomRoutes from './routes/room-routes.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/api', userRoutes.routes);
app.use('/api', roomRoutes.routes);

app.listen(config.port, () => {
  console.log(`App is listening on url http://localhost:${config.port}`);
});
