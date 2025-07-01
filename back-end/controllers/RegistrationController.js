// controllers/RegistrationController.js
const db = require("../db");

const RegistrationController = {
  // Lấy danh sách toàn bộ lượt đăng ký (cho frontend đếm số lượng)
  getAll: async (req, res) => {
    try {
      const [rows] = await db.query("SELECT * FROM registrations");
      res.json(rows);
    } catch (err) {
      console.error("❌ Lỗi getAll:", err);
      res.status(500).json({ error: "Lỗi lấy danh sách đăng ký" });
    }
  },

  // Sinh viên đăng ký khóa học
  create: async (req, res) => {
    const { studentId, courseId } = req.body;
    try {
      // Kiểm tra đã đăng ký chưa
      const [exists] = await db.query(
        "SELECT * FROM registrations WHERE student_id = ? AND course_id = ?",
        [studentId, courseId]
      );
      if (exists.length > 0) {
        return res.status(400).json({ error: "Đã đăng ký khóa học này rồi" });
      }

      // Kiểm tra giới hạn số lượng sinh viên
      const [courseRows] = await db.query(
        "SELECT max_students FROM courses WHERE id = ?",
        [courseId]
      );
      const max = courseRows[0]?.max_students || 0;
      const [countRows] = await db.query(
        "SELECT COUNT(*) AS total FROM registrations WHERE course_id = ?",
        [courseId]
      );
      const current = countRows[0].total;

      if (current >= max) {
        return res.status(400).json({ error: "Khóa học đã đầy" });
      }

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

  // Lấy khóa học đã đăng ký theo sinh viên
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

  // Admin xem toàn bộ danh sách đăng ký của sinh viên
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

  // Cập nhật trạng thái hoàn thành
  update: async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
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
};

module.exports = RegistrationController;
