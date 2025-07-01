const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

const secretKey = "mySecretKey";

const AuthController = {
  login: async (req, res) => {
    const { username, password } = req.body;
    const user = await UserModel.findByUsername(username);

    if (!user) return res.status(404).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign(
      { username: user.username, role: user.role, name: user.name },
      secretKey,
      { expiresIn: "1h" }
    );

    // ✅ Trả cả id về frontend
    res.json({
      token,
      role: user.role,
      name: user.name,
      id: user.id, // ✅ Thêm dòng này
    });
  },

  register: async (req, res) => {
    const { username, password, name, role } = req.body;

    const hash = await bcrypt.hash(password, 10);
    try {
      await UserModel.createUser(username, hash, name, role);
      res.json({ message: "Tạo tài khoản thành công!" });
    } catch (err) {
      console.error("Register error:", err);
      res.status(500).json({ error: "Tài khoản đã tồn tại hoặc lỗi server" });
    }
  },
};

module.exports = AuthController;
