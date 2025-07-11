// Import kết nối cơ sở dữ liệu
const db = require("../db");

const RegistrationController = {
  // 📌 LẤY TẤT CẢ LƯỢT ĐĂNG KÝ (dành cho frontend đếm hoặc admin xem thống kê)
  getAll: async (req, res) => {
    try {
      const [rows] = await db.query("SELECT * FROM registrations");
      res.json(rows);
    } catch (err) {
      console.error("❌ Lỗi getAll:", err);
      res.status(500).json({ error: "Lỗi lấy danh sách đăng ký" });
    }
  },

  // 📌 SINH VIÊN ĐĂNG KÝ KHÓA HỌC
  create: async (req, res) => {
    const { studentId, courseId } = req.body;

    try {
      // 🛑 B1: Kiểm tra xem sinh viên đã đăng ký khóa học này chưa
      const [exists] = await db.query(
        "SELECT * FROM registrations WHERE student_id = ? AND course_id = ?",
        [studentId, courseId]
      );
      if (exists.length > 0) {
        return res.status(400).json({ error: "Đã đăng ký khóa học này rồi" });
      }

      // 🔍 B2: Lấy thông tin khóa học (giới hạn sinh viên, thời gian đăng ký)
      const [courseRows] = await db.query(
        "SELECT max_students, registration_start, registration_end FROM courses WHERE id = ?",
        [courseId]
      );

      if (!courseRows.length) {
        return res.status(404).json({ error: "Không tìm thấy khóa học" });
      }

      const { max_students, registration_start, registration_end } =
        courseRows[0];

      // 📅 B3: Kiểm tra xem thời gian hiện tại có nằm trong thời gian đăng ký không
      const now = new Date();
      const startDate = new Date(registration_start);
      const endDate = new Date(registration_end);

      if (now < startDate || now > endDate) {
        return res.status(400).json({
          error: "Khóa học đã hết hạn đăng ký hoặc chưa mở đăng ký",
        });
      }

      // 👥 B4: Kiểm tra số lượng sinh viên đã đăng ký
      const max = max_students || 0;
      const [countRows] = await db.query(
        "SELECT COUNT(*) AS total FROM registrations WHERE course_id = ?",
        [courseId]
      );
      const current = countRows[0].total;

      if (current >= max) {
        return res.status(400).json({ error: "Khóa học đã đầy" });
      }

      // ✅ B5: Thêm dữ liệu đăng ký mới với trạng thái mặc định là 'incomplete'
      await db.query(
        "INSERT INTO registrations (student_id, course_id, status) VALUES (?, ?, 'incomplete')",
        [studentId, courseId]
      );

      res.json({ message: "Đăng ký thành công" });
    } catch (err) {
      console.error("❌ Lỗi create:", err);
      res.status(500).json({ error: "Lỗi đăng ký khóa học" });
    }
  },

  // 📌 LẤY DANH SÁCH KHÓA HỌC MÀ MỘT SINH VIÊN ĐÃ ĐĂNG KÝ
  getByStudent: async (req, res) => {
    const studentId = req.query.studentId;
    try {
      const [rows] = await db.query(
        `SELECT r.id, r.course_id, c.title, r.status 
         FROM registrations r 
         JOIN courses c ON r.course_id = c.id 
         WHERE r.student_id = ?`,
        [studentId]
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: "Lỗi lấy khóa học đã đăng ký" });
    }
  },

  // 📌 ADMIN: XEM TOÀN BỘ DANH SÁCH ĐĂNG KÝ CỦA TẤT CẢ SINH VIÊN
  getAllForAdmin: async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT 
          u.id AS student_id,
          u.name AS student_name,
          c.title AS course_title,
          r.status
        FROM registrations r
        JOIN users u ON r.student_id = u.id
        JOIN courses c ON r.course_id = c.id
        ORDER BY u.id
      `);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: "Lỗi lấy danh sách đăng ký cho admin" });
    }
  },

  // 📌 CẬP NHẬT TRẠNG THÁI HOÀN THÀNH KHÓA HỌC (dành cho admin hoặc sau khi sinh viên hoàn thành)
  update: async (req, res) => {
    const id = req.params.id; // ID của bản ghi trong bảng `registrations`
    const { status } = req.body; // Trạng thái mới: 'completed' hoặc 'incomplete'

    try {
      await db.query("UPDATE registrations SET status = ? WHERE id = ?", [
        status,
        id,
      ]);
      res.json({ message: "Cập nhật trạng thái thành công" });
    } catch (err) {
      res.status(500).json({ error: "Lỗi cập nhật trạng thái" });
    }
  },
  // 📌 HỦY ĐĂNG KÝ KHÓA HỌC (theo ID)
  delete: async (req, res) => {
    const { id } = req.params;

    try {
      const [result] = await db.query(
        "DELETE FROM registrations WHERE id = ?",
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Không tìm thấy đăng ký để xóa" });
      }

      res.json({ message: "Đã hủy đăng ký thành công" });
    } catch (err) {
      console.error("❌ Lỗi delete:", err);
      res.status(500).json({ error: "Lỗi server khi xóa đăng ký" });
    }
  },
};

module.exports = RegistrationController;
