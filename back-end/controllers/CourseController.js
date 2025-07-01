const db = require("../db");

const CourseController = {
  getAll: async (req, res) => {
    const [rows] = await db.query("SELECT * FROM courses");
    res.json(rows);
  },

  create: async (req, res) => {
    const { title, description, max_students } = req.body;
    await db.query(
      "INSERT INTO courses (title, description, max_students) VALUES (?, ?, ?)",
      [title, description, max_students]
    );

    res.json({ message: "Đã thêm khóa học" });
  },

  update: async (req, res) => {
    const id = req.params.id;
    const { title, description, max_students } = req.body;
    await db.query(
      "UPDATE courses SET title = ?, description = ?, max_students = ? WHERE id = ?",
      [title, description, max_students, id]
    );

    res.json({ message: "Đã cập nhật khóa học" });
  },

  delete: async (req, res) => {
    const id = req.params.id;
    try {
      // Xóa các bản ghi liên quan trong bảng registrations trước
      await db.query("DELETE FROM registrations WHERE course_id = ?", [id]);

      // Sau đó mới xóa khóa học
      await db.query("DELETE FROM courses WHERE id = ?", [id]);

      res.json({ message: "Đã xóa khóa học" });
    } catch (err) {
      console.error("Lỗi khi xóa khóa học:", err);
      res
        .status(500)
        .json({ error: "Không thể xóa khóa học vì có dữ liệu liên quan." });
    }
  },
};

module.exports = CourseController;
