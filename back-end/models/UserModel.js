const db = require("../db");

const UserModel = {
  async findByUsername(username) {
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    return rows[0];
  },

  async createUser(username, password, name, role) {
    const [result] = await db.query(
      "INSERT INTO users (username, password, name, role) VALUES (?, ?, ?, ?)",
      [username, password, name, role]
    );
    return result;
  },
};

module.exports = UserModel;
