import { firebaseAdmin } from '../firebase.js';
import deleteCollection from '../helpers/deleteCollection.js';
import { FieldValue } from 'firebase-admin/firestore';

const firestore = firebaseAdmin.firestore();
