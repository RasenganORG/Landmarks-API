'use strict';

import admin from 'firebase-admin';
import config from './config.js';

import { initializeApp } from 'firebase/app';

const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(config.serviceAccountKey),
});

const firebaseApp = initializeApp(config.firebaseConfig);

export { firebaseAdmin, firebaseApp };
