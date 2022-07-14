class User {
  constructor(id, firstName, lastName, displayName, avatar, status) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.displayName = displayName;
    this.avatar = avatar;
    this.status = status;
  }
}

module.exports = User;
