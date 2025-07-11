// 📦 Import các thư viện cần thiết
const express = require("express"); // Framework chính
const cors = require("cors"); // Cho phép frontend khác origin gọi API
const bodyParser = require("body-parser"); // Middleware để xử lý JSON trong req.body

// 📂 Import các Controller quản lý logic từng phần
const AuthController = require("./controllers/AuthController");
const CourseController = require("./controllers/CourseController");
const RegistrationController = require("./controllers/RegistrationController");
const UserController = require("./controllers/UserController");

// 🚀 Khởi tạo ứng dụng Express
const app = express();
const port = 3000; // Có thể đổi cổng nếu trùng hoặc deploy

// 💡 Sử dụng các middleware toàn cục
app.use(cors()); // Cho phép gọi từ các domain khác (như frontend ở cổng khác)
app.use(bodyParser.json()); // Tự động parse JSON từ request

// ===================== 🔐 AUTH API =====================
// 👉 POST /login – Đăng nhập (trả về JWT token nếu thành công)
app.post("/login", AuthController.login);

// 👉 POST /register – Tạo tài khoản mới
app.post("/register", AuthController.register);

// ===================== 📚 COURSE API =====================
// 👉 GET /courses – Lấy tất cả khóa học
app.get("/courses", CourseController.getAll);

// 👉 POST /courses – Thêm khóa học mới (admin)
app.post("/courses", CourseController.create);

// 👉 PUT /courses/:id – Cập nhật khóa học
app.put("/courses/:id", CourseController.update);

// 👉 DELETE /courses/:id – Xóa khóa học
app.delete("/courses/:id", CourseController.delete);

// ===================== 📝 REGISTRATION API =====================
// 👉 GET /registrations?studentId=... – Lấy các khóa học mà sinh viên đã đăng ký
app.get("/registrations", RegistrationController.getByStudent);

// 👉 GET /registrations/all – Trả về tất cả lượt đăng ký (dùng để đếm số lượng)
app.get("/registrations/all", RegistrationController.getAll);

// 👉 POST /registrations – Sinh viên đăng ký khóa học
app.post("/registrations", RegistrationController.create);

// 👉 PUT /registrations/:id – Cập nhật trạng thái (complete/incomplete)
app.put("/registrations/:id", RegistrationController.update);

// 👉 GET /registrations/admin – Admin xem toàn bộ đăng ký
app.get("/registrations/admin", RegistrationController.getAllForAdmin);

// 👉 (Tùy chọn) GET /admin/registrations – Alias nếu frontend gọi URL cũ
app.get("/admin/registrations", RegistrationController.getAllForAdmin);
// 👉 DELETE /registrations/:id – Hủy đăng ký
app.delete("/registrations/:id", RegistrationController.delete);

// ===================== 👥 USER API (chỉ dùng cho admin) =====================
// 👉 GET /users – Lấy danh sách tài khoản
app.get("/users", UserController.getAllUsers);

// 👉 DELETE /users/:id – Xóa tài khoản
app.delete("/users/:id", UserController.deleteUser);

// 👉 PUT /users/:id – Cập nhật tên và role
app.put("/users/:id", UserController.updateUser);

// ===================== ❌ 404 fallback =====================
// Xử lý khi không có route nào khớp
app.use((req, res) => {
  res.status(404).json({ error: "API không tồn tại!" });
});

// ===================== 🚀 START SERVER =====================
app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});
