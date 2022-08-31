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

    // add room to DB
    await roomsCollection.doc(room.id).set(room);

    // update roomMembership with userID: [roomID]
    // get document with user id which contains 'rooms' reference id array
    const docRef = await roomMembership.doc(`${room.ownerID}`).get();
    // if the doc(userID) doesn't exist, create one
    if (!docRef.exists) {
      await roomMembership
        .doc(`${room.ownerID}`)
        // the 'rooms' array holds references to the rooms from the DB
        .set({ rooms: [roomsCollection.doc(`${room.id}`)] });
    } else {
      // else update the 'rooms' array with a new reference room id
      await roomMembership.doc(`${room.ownerID}`).update({
        rooms: FieldValue.arrayUnion(roomsCollection.doc(`${room.id}`)),
      });
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
    // Reference to Firestore collections
    const roomMembership = firestore.collection('roomMembership');
    const usersCollection = firestore.collection('users');

    const userRooms = await roomMembership.doc(userID).get();
    const roomsArray = [];
    const membersIDs = new Set();
    if (!userRooms.exists) {
      res.status(404).send('No rooms found!');
    } else {
      for (const docu of userRooms.data().rooms) {
        // get room objects from DB by reference
        const room = await docu.get();
        const roomRef = firestore.doc(`/rooms/${room.data().id}`);
        // get the user id that has this room.id inside its rooms array
        const members = await roomMembership
          .where('rooms', 'array-contains', roomRef)
          .get();
        members.forEach((doc) => membersIDs.add(doc.id));
        roomsArray.push(room.data());
      }
    }

    const membersArray = [];
    // populate membersArray with user objects
    for (const id of membersIDs) {
      const user = await usersCollection.doc(id).get();
      membersArray.push({
        id: user.data().id,
        email: user.data().email,
        name: user.data().name,
      });
    }

    const rooms = [
      ...roomsArray.map((room) => {
        return { ...room, members: membersArray, chat: [] };
      }),
    ];

    console.log('seding to FE', rooms);
    res.status(200).send(rooms);
  } catch (error) {
    res.status(404).send(error.message);
    console.log(error);
  }
};

const addUserToRoomMembership = async (req, res, next) => {
  try {
    const roomID = req.params.id;
    const userID = req.body;
    const roomMembership = firestore.collection('roomMembership');

    const userReference = await roomMembership.doc(userID).get();
    // if the doc(userID) doesn't exist, create one
    if (!userReference.exists) {
      await roomMembership
        .doc(userID)
        // the 'rooms' array holds references to the rooms from the DB
        .set({ rooms: [roomsCollection.doc(roomID)] });
    } else {
      // else update the 'rooms' array with a new reference room id
      await roomMembership.doc(userID).update({
        rooms: FieldValue.arrayUnion(roomsCollection.doc(roomID)),
      });
    }

    res.sendStatus(200);
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
  addUserToRoomMembership,
  deleteRoom,
  deleteAllRooms,
};
