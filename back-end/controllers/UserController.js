const db = require("../db");

const UserController = {
  getAllUsers: async (req, res) => {
    const [rows] = await db.query("SELECT id, username, name, role FROM users");
    res.json(rows);
  },

  deleteUser: async (req, res) => {
    const id = req.params.id;
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ message: "Xóa thành công" });
  },

  updateUser: async (req, res) => {
    const id = req.params.id;
    const { name, role } = req.body;
    await db.query("UPDATE users SET name = ?, role = ? WHERE id = ?", [
      name,
      role,
      id,
    ]);
    res.json({ message: "Cập nhật thành công" });
  },
};

module.exports = UserController;
