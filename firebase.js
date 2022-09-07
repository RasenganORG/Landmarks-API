'use strict';

import admin from 'firebase-admin';
import config from './config.js';

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(config.serviceAccountKey),
});

const firebaseApp = initializeApp(config.firebaseConfig);

const auth = getAuth(firebaseApp);

export { firebaseAdmin, firebaseApp, auth };
