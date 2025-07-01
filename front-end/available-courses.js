async function fetchCourses() {
  const api = "http://localhost:3000";
  const studentId = localStorage.getItem("userId");
  const tbody = document.getElementById("courseList");

  const [courses, registrations] = await Promise.all([
    fetch(`${api}/courses`).then((r) => r.json()),
    fetch(`${api}/registrations/all`).then((r) => r.json()),
  ]);

  const regCount = {};
  registrations.forEach((r) => {
    regCount[r.course_id] = (regCount[r.course_id] || 0) + 1;
  });

  const registeredIds = registrations
    .filter((r) => r.student_id == studentId)
    .map((r) => r.course_id);

  tbody.innerHTML = "";
  courses.forEach((course, i) => {
    if (registeredIds.includes(course.id)) return;

    const isFull = (regCount[course.id] || 0) >= course.max_students;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${course.title}</td>
      <td>${course.description}</td>
      <td>${regCount[course.id] || 0}/${course.max_students}</td>
      <td>${
        isFull
          ? "<em>Đã đầy</em>"
          : `<button onclick="register(${course.id})">Đăng ký</button>`
      }</td>`;
    tbody.appendChild(row);
  });
}

async function register(courseId) {
  const studentId = localStorage.getItem("userId");
  const res = await fetch("http://localhost:3000/registrations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId: Number(studentId), courseId }),
  });
  const data = await res.json();
  alert(data.message || data.error || "Có lỗi xảy ra!");
  fetchCourses();
}
