'use strict';

const firebase = require('../db');
const firestore = firebase.firestore();

const Room = require('../models/room');

// Add room to room collection
// update User doc to add room to room list

// based on invite update Room doc to add members to member list
// invite to /rooms/:roomID

const addRoomToDB = async (req, res, next) => {
  try {
    // name, ownerID, map, events, members, chatID
    const roomForm = req.body;
    console.log('Received roomForm from fe:', roomForm);
    // Reference to Firestore 'rooms' collection
    const roomsCollection = firestore.collection('rooms');

    const room = {
      ...roomForm,
      id: roomsCollection.doc().id,
    };

    await roomsCollection.doc(room.id).set(room);
    // send back the room object
    console.log('Sending response:', room);
    res.status(201).send(room);
  } catch (error) {
    res.status(400).send(error.message);
    console.log(error);
  }
};

const getRoomByID = async (req, res, next) => {
  try {
    // Get room id from GET params (:id)
    const id = req.params.id;
    // Reference to Firestore 'rooms' collection
    const roomsCollection = firestore.collection('rooms');

    const room = await roomsCollection.doc(id).get();
    if (!room.exists) throw new Error('Room not found !');

    res.status(200).send(room.data());
  } catch (error) {
    res.status(404).send(error.message);
    console.log(error);
  }
};

const getUserRooms = async (req, res, next) => {
  try {
    const userID = req.params.userID;
    // Reference to Firestore 'rooms' collection
    const roomsCollection = firestore.collection('rooms');
    // Reference to a QuerySnapshot whith all rooms that contains the userID
    const roomsSnapshot = await roomsCollection
      .where('members', 'array-contains', userID)
      .get();

    if (roomsSnapshot.empty) {
      req.staus(104).send(`You don't have any rooms yet.`);
    } else {
      const roomsArray = [];

      roomsSnapshot.forEach((doc) => roomsArray.push(doc.data()));
      console.log('roomsArray', roomsArray);
      res.status(200).send(roomsArray);
    }

    // if (data.empty) {
    //   res.status(404).send('No rooms found');
    // } else {
    //   data.forEach((doc) => {
    //     const room = new Room(
    //       doc.data().id,
    //       doc.data().name,
    //       doc.data().ownerID,
    //       doc.data().map,
    //       doc.data().events,
    //       doc.data().members,
    //       doc.data().chatID
    //     );
    //     roomsArray.push(room);
    //   });
    //   res.status(200).send(roomsArray);
    // }
  } catch (error) {
    res.status(404).send(error.message);
    console.log(error);
  }
};

const updateRoom = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const room = firestore.collection('rooms').doc(id);
    await room.update(data);
    res.status(200).send('Room was successfully edited !');
  } catch (error) {
    res.status(404).send(error.message);
    console.log(error);
  }
};

const deleteRoom = async (req, res, next) => {
  try {
    const id = req.params.id;
    await firestore.collection('rooms').doc(id).delete();
    res.status(200).send('Room deleted !');
  } catch (error) {
    res.status(404).send(error.message);
    console.log(error);
  }
};

const deleteAllRooms = async (req, res, next) => {
  try {
    const isEmpty = await deleteCollection(firestore, 'rooms', 3);
    if (isEmpty) res.status(204).send('All rooms have been deleted');
  } catch (error) {
    res.status(404).send(error.message);
    console.log(error);
  }
};

module.exports = {
  addRoomToDB,
  getRoomByID,
  getUserRooms,
  updateRoom,
  deleteRoom,
  deleteAllRooms,
};
