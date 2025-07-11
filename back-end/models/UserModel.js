// 📦 Import module kết nối cơ sở dữ liệu
const db = require("../db");

// 👤 Model thao tác với bảng 'users'
const UserModel = {
  // ✅ Tìm người dùng theo username (dùng trong đăng nhập)
  async findByUsername(username) {
    // Truy vấn dữ liệu trong bảng users theo username
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

    // Trả về user đầu tiên (vì username là duy nhất)
    return rows[0];
  },

  // ✅ Tạo tài khoản mới (dùng trong đăng ký)
  async createUser(username, password, name, role) {
    // Thêm bản ghi vào bảng users với các trường: username, password đã mã hóa, tên người dùng và vai trò (admin/student)
    const [result] = await db.query(
      "INSERT INTO users (username, password, name, role) VALUES (?, ?, ?, ?)",
      [username, password, name, role]
    );

    // Trả về kết quả insert (gồm insertId,... nếu cần dùng tiếp)
    return result;
  },
};

// 📤 Xuất module để các controller sử dụng
module.exports = UserModel;
