'use strict';

import firebase from '../db.js';
import deleteCollection from '../helpers/deleteCollection.js';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const firestore = firebase.firestore();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const register = async (req, res, next) => {
  try {
    // name, email, password
    const registerForm = req.body;
    console.log('sent from frontend', registerForm);
    // Check if email or password were sent
    if (!registerForm.email || !registerForm.password) {
      return res.status(422).json({
        email: 'Email is required !',
        password: 'Password is required !',
      });
    }
    // Reference to Firestore 'users' collection
    const usersCollection = firestore.collection('users');
    // Reference to a QuerySnapshot whith all users that have the requested name
    const userSnapshot = await usersCollection
      .where('name', '==', registerForm.name)
      .get();
    // Check if user already exists:
    if (!userSnapshot.empty) {
      throw new Error('Username is taken !');
    }

    const user = {
      ...registerForm,
      id: usersCollection.doc().id,
    };

    user.token = generateToken(user.id);

    console.log('Added User in DB:', user);

    await usersCollection.doc(user.id).set(user);
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error.message);
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

const getLoggedUser = async (req, res, next) => {
  try {
    // Get user name from GET Params
    const email = req.params.email;
    const pwd = req.query.pwd;
    // Reference to Firestore 'users' collection
    const usersCollection = firestore.collection('users');
    // Reference to a QuerySnapshot whith all users that have the requested email
    const userSnapshot = await usersCollection
      .where('email', '==', email)
      .get();

    if (userSnapshot.empty) {
      res.status(404).send('Username or password invalid!');
    } else {
      let user;

      userSnapshot.forEach((doc) => (user = { ...doc.data() }));
      console.log('user from db:', user);

      const result = user.password === pwd ? user : null;
      if (result) res.status(200).send(result);
      else res.status(404).send('Username or password invalid!');
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
  getAllUsers,
  getUser,
  getLoggedUser,
  updateUser,
  deleteUser,
  deleteAllUsers,
};
