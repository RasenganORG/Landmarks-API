const express = require('express');
const {
  addUser,
  getAllUsers,
  getUser,
  getLoggedUser,
  updateUser,
  deleteUser,
  deleteAllUsers,
} = require('../controllers/userController');

const router = express.Router();

router.post('/user', addUser);
router.get('/users', getAllUsers);
router.get('/user/:name', getUser);
router.get('/getLoggedUser/:email', getLoggedUser);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);
router.delete('/users', deleteAllUsers);

module.exports = {
  routes: router,
};
