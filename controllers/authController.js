'use strict';

import { firebaseAdmin } from '../firebase.js';
import jwt from 'jsonwebtoken';

const firestore = firebaseAdmin.firestore();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const register = async (req, res, next) => {
  try {
    // name, email, password, avatar
    const { name, email, password, avatar } = req.body;
    // Check if email or password were sent
    if (!email || !password) {
      return res.status(422).json({
        email: 'Email is required !',
        password: 'Password is required !',
      });
    }
    // Reference to Firestore 'users' collection
    const usersCollection = firestore.collection('users');
    // Reference to a QuerySnapshot whith all users that have the requested name
    const userSnapshot = await usersCollection.where('name', '==', name).get();
    // Check if user already exists:
    if (!userSnapshot.empty) {
      throw new Error('Username is taken !');
    } else {
      const user = {
        name,
        email,
        password,
        avatar,
        id: usersCollection.doc().id,
      };

      user.token = generateToken(user.id);

      // console.log('Added User in DB:', user);

      await usersCollection.doc(user.id).set(user);
      res.status(201).send(user);
    }
  } catch (error) {
    res.status(400).send(error.message);
    console.log(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
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

      const result = user.password === password ? user : null;
      if (result) res.status(200).send(result);
      else res.status(404).send('Username or password invalid!');
    }
  } catch (error) {
    res.status(404).send(error.message);
    console.log(error);
  }
};

export { register, login };
