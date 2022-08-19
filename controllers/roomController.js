'use strict';

const firebase = require('../db');
const firestore = firebase.firestore();
const { deleteCollection } = require('../helpers/deleteCollection');
const { FieldValue } = require('firebase-admin/firestore');

const createRoom = async (req, res, next) => {
  try {
    // name, ownerID, map, events, members, chatID
    const room = req.body;
    console.log('Received room from fe:', room);
    // Reference to Firestore 'rooms' collection
    const roomsCollection = firestore.collection('rooms');
    const roomMembership = firestore.collection('roomMembership');

    // // add room to DB
    // await roomsCollection.doc(room.id).set(room);

    // update roomMembership with userID: [roomID]
    const docRef = await roomMembership.doc(`${room.ownerID}`).get();
    if (!docRef.exists) {
      await roomMembership
        .doc(`${room.ownerID}`)
        .set({ rooms: [`${room.id}`] });
    } else {
      await roomMembership
        .doc(`${room.ownerID}`)
        .update({ rooms: FieldValue.arrayUnion(`${room.id}`) });
    }
    res.sendStatus(200);
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

const getRoomsForUser = async (req, res, next) => {
  try {
    const userID = req.params.userID;
    // Reference to Firestore 'rooms' collection
    const roomsCollection = firestore.collection('rooms');
    // Reference to a QuerySnapshot whith all rooms that contains the userID
    const roomsSnapshot = await roomsCollection
      .where('members', 'array-contains', userID)
      .get();

    if (roomsSnapshot.size === 0) {
      res.status(404).send('No rooms found!');
    } else {
      const roomsArray = [];

      roomsSnapshot.forEach((doc) => roomsArray.push(doc.data()));
      console.log('roomsArray', roomsArray);
      res.status(200).send(roomsArray);
    }
  } catch (error) {
    res.status(404).send(error.message);
    console.log(error);
  }
};

const updateRoom = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const roomReference = firestore.collection('rooms').doc(id);
    await roomReference.update(data);
    const room = await roomReference.get();
    res.status(200).send(room.data());
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
  createRoom,
  getRoomByID,
  getRoomsForUser,
  updateRoom,
  deleteRoom,
  deleteAllRooms,
};
