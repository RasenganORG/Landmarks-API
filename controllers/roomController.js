'use strict';

import { firebaseAdmin, firebaseApp } from '../firebase.js';
import deleteCollection from '../helpers/deleteCollection.js';
import { FieldValue } from 'firebase-admin/firestore';

const firestore = firebaseAdmin.firestore();

const createRoom = async (req, res, next) => {
  try {
    // name, ownerID, map, events, inviteToken, members, chatID
    const room = req.body;
    console.log('Received room from fe:', room);
    // Reference to Firestore 'rooms' collection
    const roomsCollection = firestore.collection('rooms');
    const roomMembership = firestore.collection('roomMembership');

    // add room to DB
    await roomsCollection.doc(room.id).set(room);

    // update roomMembership with userID: [roomID]
    // get document with user id which contains 'rooms' reference id array
    const userRef = await roomMembership.doc(`${room.ownerID}`).get();
    // if the doc(userID) doesn't exist, create one
    if (!userRef.exists) {
      await roomMembership
        .doc(`${room.ownerID}`)
        // the 'rooms' array holds references to the rooms from the DB
        .set({ rooms: [roomsCollection.doc(`${room.id}`)] });
    } else {
      // else update the 'rooms' array with a new reference room id
      // arrayUnion does not duplicate values
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

    // firestore -> roomMembership -> userID -> rooms[roomReferences];
    // GET user document from roomMembership
    const userRef = await roomMembership.doc(userID).get();
    const roomsArray = [];
    const membersIDs = new Set();
    const membersArray = [];

    if (!userRef.exists || userRef.data().rooms.length === 0) {
      throw new Error('No rooms found !');
    } else {
      // GET all rooms inside user document from roomMembership
      for (const docu of userRef.data().rooms) {
        // get room objects from DB by reference
        const room = await docu.get();
        roomsArray.push(room.data());
        // Search for users that have the current room
        // GET the user id that has current room.id inside its rooms array
        const members = await roomMembership
          .where('rooms', 'array-contains', docu)
          .get();
        members.forEach((user) => membersIDs.add(user.id));
      }

      // Populate membersArray with user objects
      for (const id of membersIDs) {
        const user = await usersCollection.doc(id).get();
        membersArray.push({
          id: user.data().id,
          email: user.data().email,
          name: user.data().name,
        });
      }

      // Populate chat

      // Build final rooms array which contains previously obtained room properties + members array + chat array
      const rooms = [
        ...roomsArray.map((room) => {
          return { ...room, members: membersArray, chat: [] };
        }),
      ];

      // console.log('Sending to FE', rooms);
      res.status(200).send(rooms);
    }
  } catch (error) {
    res.status(404).send(error.message);
    console.log(error);
  }
};

const addUserToRoomMembership = async (req, res, next) => {
  try {
    const roomToken = req.params.token;
    const userID = req.body.userID;
    const roomMembership = firestore.collection('roomMembership');
    const roomsCollection = firestore.collection('rooms');

    // Get room with given roomToken
    const roomSnapshot = await roomsCollection
      .where('inviteToken', '==', roomToken)
      .get();
    // Check if inviteToken is valid
    if (roomSnapshot.empty) throw new Error('Invalid invite token !');
    let room = null;
    roomSnapshot.forEach((doc) => (room = { ...doc.data() }));
    console.log('room from db:', room);

    // PUT roomID to roomMembership-> UserID->rooms
    const userReference = await roomMembership.doc(userID).get();
    // if the doc(userID) doesn't exist, create one
    if (!userReference.exists) {
      await roomMembership
        .doc(userID)
        // the 'rooms' array holds references to the rooms from the DB
        .set({ rooms: [roomsCollection.doc(room.id)] });
    } else {
      // else update the 'rooms' array with a new reference room id
      // arrayUnion does not duplicate values
      await roomMembership.doc(userID).update({
        rooms: FieldValue.arrayUnion(roomsCollection.doc(room.id)),
      });
    }

    // Add chat and members to room

    res.status(200).send(room);
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
    const isEmpty =
      (await deleteCollection(firestore, 'rooms', 3)) &&
      (await deleteCollection(firestore, 'roomMembership', 3));
    if (isEmpty) res.status(202).send('All rooms have been deleted');
  } catch (error) {
    res.status(404).send(error.message);
    console.log(error);
  }
};

export {
  createRoom,
  getRoomByID,
  getRoomsForUser,
  addUserToRoomMembership,
  deleteRoom,
  deleteAllRooms,
};
