'use strict';

import admin from 'firebase-admin';
import config from './config.js';

const db = admin.initializeApp({
  credential: admin.credential.cert(config.serviceAccountKey),
});

export default db;
