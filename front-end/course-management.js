fetchCourses();
document.getElementById("courseForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // Ngăn reload trang

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const max_students = +document.getElementById("max_students").value;

  if (!title || !description || !max_students) {
    alert("Vui lòng nhập đầy đủ thông tin");
    return;
  }

  const res = await fetch(`${api}/courses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, max_students }),
  });

  if (res.ok) {
    // Reset form
    document.getElementById("courseForm").reset();
    fetchCourses();
  } else {
    alert("Thêm khóa học thất bại!");
  }
});
async function fetchCourses() {
  const tbody = document.getElementById("courseTable");
  if (!tbody) return;

  const res = await fetch(`${api}/courses`);
  const courses = await res.json();
  tbody.innerHTML = "";

  courses.forEach((c) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${c.id}</td>
      <td><input value="${c.title}" id="title-${c.id}" /></td>
      <td><input value="${c.description}" id="desc-${c.id}" /></td>
      <td><input type="number" value="${c.max_students}" id="max-${c.id}" /></td>
      <td>
        <button onclick="updateCourse(${c.id})">Sửa</button>
        <button onclick="deleteCourse(${c.id})">Xóa</button>
      </td>`;
    tbody.appendChild(row);
  });
}

async function updateCourse(id) {
  const title = document.getElementById(`title-${id}`).value;
  const description = document.getElementById(`desc-${id}`).value;
  const max_students = +document.getElementById(`max-${id}`).value;

  await fetch(`${api}/courses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, max_students }),
  });
  fetchCourses();
}

async function deleteCourse(id) {
  if (confirm("Xóa khóa học?")) {
    await fetch(`${api}/courses/${id}`, { method: "DELETE" });
    fetchCourses();
  }
}
