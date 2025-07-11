// 📦 Import module kết nối cơ sở dữ liệu
const db = require("../db");

// 🎓 Bộ điều khiển quản lý KHÓA HỌC (Courses)
const CourseController = {
  // ✅ [GET] /api/courses – Lấy danh sách tất cả khóa học
  getAll: async (req, res) => {
    const [rows] = await db.query("SELECT * FROM courses"); // Truy vấn toàn bộ dữ liệu từ bảng courses
    res.json(rows); // Trả về danh sách khóa học dưới dạng JSON
  },

  // ✅ [POST] /api/courses – Thêm mới khóa học
  create: async (req, res) => {
    // Lấy dữ liệu từ body của request
    const {
      title,
      description,
      max_students,
      registration_start,
      registration_end,
    } = req.body;

    // Thêm khóa học vào CSDL
    await db.query(
      `INSERT INTO courses 
       (title, description, max_students, registration_start, registration_end) 
       VALUES (?, ?, ?, ?, ?)`,
      [title, description, max_students, registration_start, registration_end]
    );

    res.json({ message: "Đã thêm khóa học" }); // Phản hồi về frontend
  },

  // ✅ [PUT] /api/courses/:id – Cập nhật thông tin khóa học
  update: async (req, res) => {
    const id = req.params.id; // Lấy ID từ URL
    const {
      title,
      description,
      max_students,
      registration_start,
      registration_end,
    } = req.body;

    // Cập nhật thông tin trong DB
    await db.query(
      `UPDATE courses 
       SET title = ?, description = ?, max_students = ?, 
           registration_start = ?, registration_end = ? 
       WHERE id = ?`,
      [
        title,
        description,
        max_students,
        registration_start,
        registration_end,
        id,
      ]
    );

    res.json({ message: "Đã cập nhật khóa học" }); // Phản hồi thành công
  },

  // ✅ [DELETE] /api/courses/:id – Xóa khóa học
  delete: async (req, res) => {
    const id = req.params.id;

    try {
      // 🧹 Xóa tất cả lượt đăng ký liên quan đến khóa học này trước (tránh lỗi ràng buộc khóa ngoại)
      await db.query("DELETE FROM registrations WHERE course_id = ?", [id]);

      // Sau đó xóa khóa học
      await db.query("DELETE FROM courses WHERE id = ?", [id]);

      res.json({ message: "Đã xóa khóa học" });
    } catch (err) {
      // Nếu có lỗi (ví dụ: lỗi ràng buộc, CSDL đang dùng...), trả lỗi 500
      console.error("Lỗi khi xóa khóa học:", err);
      res.status(500).json({
        error: "Không thể xóa khóa học vì có dữ liệu liên quan.",
      });
    }
  },
};

// 📤 Xuất module để dùng trong router
module.exports = CourseController;
