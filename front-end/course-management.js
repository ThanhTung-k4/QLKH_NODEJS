fetchCourses();

document.getElementById("courseForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const max_students = +document.getElementById("max_students").value;
  const registration_start = document.getElementById("regStartDate").value;
  const registration_end = document.getElementById("regEndDate").value;

  if (
    !title ||
    !description ||
    !max_students ||
    !registration_start ||
    !registration_end
  ) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  const res = await fetch(`${api}/courses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title, // đồng bộ field
      description,
      max_students,
      registration_start,
      registration_end,
    }),
  });

  if (res.ok) {
    document.getElementById("courseForm").reset();
    fetchCourses();
  } else {
    alert("Thêm khóa học thất bại!");
  }
});

// ✅ Hàm format ngày đúng theo múi giờ địa phương (tránh UTC lệch ngày)
function formatDateInput(dateStr) {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function fetchCourses() {
  const tbody = document.getElementById("courseTable");
  if (!tbody) return;

  const res = await fetch(`${api}/courses`);
  const courses = await res.json();
  tbody.innerHTML = "";

  courses.forEach((c) => {
    const regStart = c.registration_start
      ? formatDateInput(c.registration_start)
      : "";
    const regEnd = c.registration_end
      ? formatDateInput(c.registration_end)
      : "";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${c.id}</td>
      <td><input value="${c.title}" id="title-${c.id}" /></td>
      <td><input value="${c.description}" id="desc-${c.id}" /></td>
      <td><input type="number" value="${c.max_students}" id="max-${c.id}" /></td>
      <td><input type="date" value="${regStart}" id="start-${c.id}" /></td>
      <td><input type="date" value="${regEnd}" id="end-${c.id}" /></td>
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
  const registration_start = document.getElementById(`start-${id}`).value;
  const registration_end = document.getElementById(`end-${id}`).value;

  const res = await fetch(`${api}/courses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      description,
      max_students,
      registration_start,
      registration_end,
    }),
  });

  if (!res.ok) {
    alert("Cập nhật thất bại!");
  }

  fetchCourses();
}

async function deleteCourse(id) {
  if (confirm("Xóa khóa học?")) {
    await fetch(`${api}/courses/${id}`, { method: "DELETE" });
    fetchCourses();
  }
}
async function searchCourses() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const tbody = document.getElementById("courseTable");
  if (!tbody) return;

  const res = await fetch(`${api}/courses`);
  const courses = await res.json();
  tbody.innerHTML = "";

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(keyword)
  );

  filtered.forEach((c) => {
    const regStart = c.registration_start
      ? formatDateInput(c.registration_start)
      : "";
    const regEnd = c.registration_end
      ? formatDateInput(c.registration_end)
      : "";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${c.id}</td>
      <td><input value="${c.title}" id="title-${c.id}" /></td>
      <td><input value="${c.description}" id="desc-${c.id}" /></td>
      <td><input type="number" value="${c.max_students}" id="max-${c.id}" /></td>
      <td><input type="date" value="${regStart}" id="start-${c.id}" /></td>
      <td><input type="date" value="${regEnd}" id="end-${c.id}" /></td>
      <td>
        <button onclick="updateCourse(${c.id})">Sửa</button>
        <button onclick="deleteCourse(${c.id})">Xóa</button>
      </td>`;
    tbody.appendChild(row);
  });
}
