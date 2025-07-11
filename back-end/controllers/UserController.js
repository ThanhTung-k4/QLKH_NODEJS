// 📦 Import module kết nối CSDL
const db = require("../db");

// 👥 Bộ điều khiển quản lý người dùng (chỉ admin có quyền dùng)
const UserController = {
  // ✅ [GET] /api/users – Lấy toàn bộ danh sách người dùng
  getAllUsers: async (req, res) => {
    // Truy vấn bảng users, chỉ lấy các cột cần thiết
    const [rows] = await db.query("SELECT id, username, name, role FROM users");
    // Trả về danh sách người dùng
    res.json(rows);
  },

  // ✅ [DELETE] /api/users/:id – Xóa người dùng theo ID
  deleteUser: async (req, res) => {
    const id = req.params.id; // ID lấy từ URL (ví dụ: /api/users/5)

    // Xóa bản ghi trong bảng users
    await db.query("DELETE FROM users WHERE id = ?", [id]);

    // Phản hồi thành công
    res.json({ message: "Xóa thành công" });
  },

  // ✅ [PUT] /api/users/:id – Cập nhật thông tin người dùng
  updateUser: async (req, res) => {
    const id = req.params.id; // ID của người dùng cần cập nhật
    const { name, role } = req.body; // Lấy thông tin từ body

    // Cập nhật name và role của người dùng
    await db.query("UPDATE users SET name = ?, role = ? WHERE id = ?", [
      name,
      role,
      id,
    ]);

    res.json({ message: "Cập nhật thành công" });
  },
};

// 📤 Xuất controller để router sử dụng
module.exports = UserController;
