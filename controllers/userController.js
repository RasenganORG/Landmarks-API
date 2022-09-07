'use strict';

import { firebaseAdmin } from '../firebase.js';
import deleteCollection from '../helpers/deleteCollection.js';
import User from '../models/user.js';

const firestore = firebaseAdmin.firestore();

const getUser = async (req, res, next) => {
  try {
    // Get user name from GET Params
    const id = req.params.id;
    // Reference to Firestore 'users' collection
    const usersCollection = firestore.collection('users');
    // Reference to user document snapshot
    const user = await usersCollection.doc(id).get();

    if (!user.exists) {
      throw new Error('User not found !');
    } else {
      console.log('user from db:', user.data());
      res.status(200).send(user.data());
    }
  } catch (error) {
    res.status(404).send(error.message);
    console.log(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = firestore.collection('users');
    const data = await users.get();
    const usersArray = [];

    if (data.empty) {
      res.status(404).send('No users found');
    } else {
      data.forEach((doc) => {
        const user = new User(
          doc.data().id,
          doc.data().name,
          doc.data().email,
          doc.data().password,
          doc.data().token
        );
        usersArray.push(user);
      });
      res.status(200).send(usersArray);
    }
  } catch (error) {
    res.status(404).send(error.message);
    console.log(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const userReference = firestore.collection('users').doc(id);
    await userReference.update(data);
    const user = await userReference.get();
    res.status(200).send(user.data());
  } catch (error) {
    res.status(404).send(error.message);
    console.log(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    await firestore.collection('users').doc(id).delete();
    res.status(200).send('User deleted !');
  } catch (error) {
    res.status(404).send(error.message);
    console.log(error);
  }
};

const deleteAllUsers = async (req, res, next) => {
  try {
    const isEmpty = await deleteCollection(firestore, 'users', 3);
    if (isEmpty) res.status(204).send('All users have been deleted');
  } catch (error) {
    res.status(404).send(error.message);
    console.log(error);
  }
};

export { getAllUsers, getUser, updateUser, deleteUser, deleteAllUsers };
