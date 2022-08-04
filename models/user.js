'use strict';

class User {
  constructor(id, name, email, password, token, roomList) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.token = token;
    this.roomList = roomList;
  }
}

module.exports = User;
