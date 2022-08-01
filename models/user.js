class User {
  // constructor(id, firstName, lastName, displayName, avatar, status) {
  //   this.id = id;
  //   this.firstName = firstName;
  //   this.lastName = lastName;
  //   this.displayName = displayName;
  //   this.avatar = avatar;
  //   this.status = status;
  // }
  constructor(id, name, email, password, token) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.token = token;
  }
}

module.exports = User;
