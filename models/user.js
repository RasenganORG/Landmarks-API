'use strict';

class User {
  constructor(id, name, email, password, token) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.token = token;
  }
}

export default User;
