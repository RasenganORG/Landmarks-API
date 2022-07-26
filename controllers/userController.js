'use strict';

const firebase = require('../db');
const User = require('../models/user');
const firestore = firebase.firestore();
const { deleteCollection } = require('../helpers/deleteCollection');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const addUser = async (req, res, next) => {
  try {
    // name, email, password
    const registerForm = req.body;
    console.log('sent from frontend', registerForm);
    // Reference to Firestore 'users' collection
    const usersCollection = firestore.collection('users');
    // Reference to a QuerySnapshot whith all users that have the requested name
    const userSnapshot = await usersCollection
      .where('name', '==', registerForm.name)
      .get();
    // Check if user already exists:
    if (!userSnapshot.empty) {
      throw new Error('User already exists !');
    }

    const user = {
      ...registerForm,
      _id: firestore.collection('users').doc().id,
    };

    user.token = generateToken(user._id);

    console.log(user);

    await firestore.collection('users').doc(user._id).set(user);
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error.message);
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
          doc.data()._id,
          doc.data().name,
          doc.data().email,
          doc.data().password,
          doc.data().token
        );
        usersArray.push(user);
      });
      res.send(usersArray);
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
};

const getUser = async (req, res, next) => {
  try {
    // Get user name from GET Params
    const name = req.params.name;
    // Reference to Firestore 'users' collection
    const usersCollection = firestore.collection('users');
    // Reference to a QuerySnapshot whith all users that have the requested name
    const userSnapshot = await usersCollection.where('name', '==', name).get();

    if (userSnapshot.empty) {
      res.status(404).send('User with the given name not found !');
    } else {
      let user;
      userSnapshot.forEach((doc) => (user = { ...doc.data() }));
      console.log('user from db:', user);
      res.send(user);
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const user = firestore.collection('users').doc(id);
    await user.update(data);
    res.send('User data updated successfully');
  } catch (error) {
    res.status(404).send(error.message);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    await firestore.collection('users').doc(id).delete();
    res.send('User deleted !');
  } catch (error) {
    res.status(404).send(error.message);
  }
};

const deleteAllUsers = async (req, res, next) => {
  try {
    const isEmpty = await deleteCollection(firestore, 'users', 3);
    if (isEmpty) res.status(200).send('All users have been deleted');
  } catch (error) {
    res.status(404).send(error.message);
  }
};

module.exports = {
  addUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  deleteAllUsers,
};
