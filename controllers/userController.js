'use strict';

import { firebaseAdmin, auth } from '../firebase.js';
import deleteCollection from '../helpers/deleteCollection.js';
import User from '../models/user.js';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';

const firestore = firebaseAdmin.firestore();

const register = async (req, res, next) => {
  try {
    // name, email, password
    const { name, email, password, avatar } = req.body;
    console.log('sent from frontend', { name, email, password });
    // Check if email or password were sent
    if (!email || !password) {
      return res.status(422).json({
        email: 'Email is required !',
        password: 'Password is required !',
      });
    }
    const usersCollection = firestore.collection('users');
    // Reference to a QuerySnapshot whith all users that have the requested name
    const userSnapshot = await usersCollection.where('name', '==', name).get();
    // Check if user already exists:
    if (!userSnapshot.empty) {
      throw new Error('Username is taken !');
    } else {
      await setPersistence(auth, browserLocalPersistence);
      // Firebase Auth Create User
      await createUserWithEmailAndPassword(auth, email, password);
      // User is signed in
      const user = auth.currentUser;
      if (user) {
        await updateProfile(user, {
          displayName: name,
        });
        const setUser = {
          id: user.uid,
          name: user.displayName,
          avatar: avatar,
        };
        await usersCollection.doc(setUser.id).set(setUser);
        res.status(201).send(setUser);
      } else {
        throw new Error('No user');
      }
    }
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;

    res.status(400).send(errorMessage);
    console.log(errorCode, errorMessage);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    await setPersistence(auth, browserLocalPersistence);
    const userCred = await signInWithEmailAndPassword(auth, email, password);

    const usersCollection = firestore.collection('users');
    const userSnapshot = await usersCollection
      .where('name', '==', userCred.user.displayName)
      .get();
    if (userSnapshot.empty) {
      throw new Error('User does not exist !');
    } else {
      let user;

      userSnapshot.forEach((doc) => (user = { ...doc.data() }));
      res.status(200).send(user);
    }
  } catch (error) {
    res.status(404).send(error.message);
    console.log(error);
  }
};

const logout = async (req, res, next) => {
  try {
    // const { name, email, password, avatar } = req.body;

    await signOut(auth);
    res.sendStatus(200);
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;

    res.status(404).send(errorMessage);
    console.log(error);
  }
};

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
    if (isEmpty) res.status(202).send('All users have been deleted');
  } catch (error) {
    res.status(404).send(error.message);
    console.log(error);
  }
};

export {
  register,
  login,
  logout,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  deleteAllUsers,
};
