'use strict';

const firebase = require('../db');
const User = require('../models/user');
const firestore = firebase.firestore();

const addUser = async (req, res, next) => {
  try {
    const data = req.body;
    console.log(data);
    await firestore.collection('users').doc().set(data);
    res.send('User saved successfully');
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
      res.status(404).send('No student record found');
    } else {
      data.forEach((doc) => {
        const user = new User(
          doc.id,
          doc.data().firstName,
          doc.data().lastName,
          doc.data().displayName,
          doc.data().avatar,
          doc.data().status
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
    const id = req.params.id;
    const user = firestore.collection('users').doc(id);
    const data = await user.get();
    if (!data.exists) {
      res.status(404).send('User with the given ID not found !');
    } else {
      res.send(data.data());
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

module.exports = {
  addUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};
