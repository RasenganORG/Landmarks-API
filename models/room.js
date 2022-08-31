'use strict';

class Room {
  constructor(id, name, ownerID, createdOn, map, events, members, chatID) {
    this.id = id;
    this.name = name;
    this.ownerID = ownerID;
    this.createdOn = createdOn;
    this.map = map;
    this.events = events;
    this.members = members;
    this.chatID = chatID;
  }
}

module.exports = Room;
