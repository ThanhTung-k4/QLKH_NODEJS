// 🔐 Import thư viện mã hóa mật khẩu và xác thực JWT
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 📦 Import model thao tác với bảng users
const UserModel = require("../models/UserModel");

// 🔑 Khóa bí mật dùng để ký JWT (nên lưu vào biến môi trường thực tế)
const secretKey = "mySecretKey";

// 💼 Bộ điều khiển xác thực người dùng (Auth)
const AuthController = {
  // ✅ [POST] /login – Đăng nhập
  login: async (req, res) => {
    // 🧾 Lấy username và password từ request
    const { username, password } = req.body;

    // 🔍 Tìm user theo username
    const user = await UserModel.findByUsername(username);

    // ❌ Nếu không tìm thấy tài khoản
    if (!user) return res.status(404).json({ error: "User not found" });

    // 🔐 So sánh mật khẩu nhập vào với mật khẩu đã mã hóa trong DB
    const valid = await bcrypt.compare(password, user.password);

    // ❌ Nếu sai mật khẩu
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    // 🪪 Tạo JWT token chứa thông tin người dùng
    const token = jwt.sign(
      {
        username: user.username,
        role: user.role,
        name: user.name, // tên đầy đủ người dùng (ví dụ: sinh viên hoặc admin)
      },
      secretKey,
      { expiresIn: "1h" } // Token có hiệu lực 1 giờ
    );

    // ✅ Trả token và thông tin người dùng cho frontend để lưu
    res.json({
      token, // dùng để gửi trong Authorization header cho các API sau
      role: user.role,
      name: user.name,
      id: user.id, // Trả thêm ID để sử dụng trong các chức năng đăng ký khóa học
    });
  },

  // ✅ [POST] /register – Tạo tài khoản mới
  register: async (req, res) => {
    const { username, password, name, role } = req.body;

    // 🔐 Mã hóa mật khẩu trước khi lưu vào DB
    const hash = await bcrypt.hash(password, 10); // 10 là salt rounds

    try {
      // 🧱 Gọi hàm tạo tài khoản trong model
      await UserModel.createUser(username, hash, name, role);

      // ✅ Trả về thông báo thành công
      res.json({ message: "Tạo tài khoản thành công!" });
    } catch (err) {
      // ❌ Nếu lỗi (ví dụ: username trùng), trả về lỗi 500
      console.error("Register error:", err);
      res.status(500).json({ error: "Tài khoản đã tồn tại hoặc lỗi server" });
    }
  },
};

// 📤 Xuất controller ra ngoài để router sử dụng
module.exports = AuthController;
