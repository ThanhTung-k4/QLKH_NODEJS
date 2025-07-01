const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Controllers
const AuthController = require("./controllers/AuthController");
const CourseController = require("./controllers/CourseController");
const RegistrationController = require("./controllers/RegistrationController");
const UserController = require("./controllers/UserController");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// ==== AUTH ====
app.post("/login", AuthController.login);
app.post("/register", AuthController.register);

// ==== COURSES ====
app.get("/courses", CourseController.getAll);
app.post("/courses", CourseController.create);
app.put("/courses/:id", CourseController.update);
app.delete("/courses/:id", CourseController.delete);

// ==== REGISTRATIONS ====
app.get("/registrations", RegistrationController.getByStudent);
app.get("/registrations/all", RegistrationController.getAll);
app.post("/registrations", RegistrationController.create);
app.put("/registrations/:id", RegistrationController.update);
app.get("/registrations/admin", RegistrationController.getAllForAdmin); // ✅ nên gọi như thế này
app.get("/admin/registrations", RegistrationController.getAllForAdmin); // 👈 nếu frontend đang gọi cũ

// ==== USERS ====
app.get("/users", UserController.getAllUsers);
app.delete("/users/:id", UserController.deleteUser);
app.put("/users/:id", UserController.updateUser);

// ==== 404 fallback ====
app.use((req, res) => {
  res.status(404).json({ error: "API không tồn tại!" });
});

// ==== SERVER START ====
app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});
