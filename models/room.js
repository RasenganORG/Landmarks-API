'use strict';

class Room {
  constructor(id, name, ownerID, map, events, members, chatID) {
    this.id = id;
    this.name = name;
    this.ownerID = ownerID;
    this.map = map;
    this.events = events;
    this.members = members;
    this.chatID = chatID;
  }
}

module.exports = Room;
