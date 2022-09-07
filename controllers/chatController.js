import { firebaseAdmin } from '../firebase.js';
import deleteCollection from '../helpers/deleteCollection.js';
import { FieldValue } from 'firebase-admin/firestore';

const firestore = firebaseAdmin.firestore();

const createChat = async (req, res, next) => {
  try {
  } catch (error) {
    res.status(404).send(error.message);
    console.log(error);
  }
};

export { createChat };
