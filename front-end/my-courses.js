const api = "http://localhost:3000";
let allCourses = [];

// Gọi khi trang load
document.addEventListener("DOMContentLoaded", fetchMyCourses);

// Lấy danh sách khóa học đã đăng ký
async function fetchMyCourses() {
  const studentId = localStorage.getItem("userId");
  if (!studentId) {
    alert("Không tìm thấy thông tin sinh viên!");
    return;
  }

  try {
    const res = await fetch(`${api}/registrations?studentId=${studentId}`);
    const data = await res.json();
    allCourses = data;
    renderMyCourses(data);
  } catch (err) {
    console.error("Lỗi lấy danh sách:", err);
    alert("Không thể tải danh sách khóa học!");
  }
}

// Hiển thị danh sách
function renderMyCourses(data) {
  const tbody = document.getElementById("myCourses");
  tbody.innerHTML = "";

  data.forEach((c, i) => {
    const row = document.createElement("tr");
    if (c.status === "completed") row.classList.add("completed");

    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${c.title}</td>
      <td>${
        c.status === "completed" ? "✅ Hoàn thành" : "⏳ Chưa hoàn thành"
      }</td>
      <td>
        <input type="checkbox"
               ${c.status === "completed" ? "checked disabled" : ""}
               onclick="markCompleted(${c.id})" />
      </td>
      <td>
        <button onclick="cancelRegistration(${c.id})"
                ${c.status === "completed" ? "disabled" : ""}>
          Hủy
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Đánh dấu hoàn thành khóa học
async function markCompleted(regId) {
  try {
    const res = await fetch(`${api}/registrations/${regId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "completed" }),
    });

    if (!res.ok) throw new Error("Lỗi cập nhật");
    fetchMyCourses();
  } catch (err) {
    console.error("Lỗi đánh dấu hoàn thành:", err);
    alert("Không thể cập nhật trạng thái khóa học!");
  }
}

// Hủy đăng ký khóa học
async function cancelRegistration(regId) {
  if (!confirm("Bạn có chắc chắn muốn hủy đăng ký khóa học này không?")) return;

  try {
    const res = await fetch(`${api}/registrations/${regId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Lỗi xóa");
    fetchMyCourses();
  } catch (err) {
    console.error("Lỗi hủy đăng ký:", err);
    alert("Không thể hủy đăng ký khóa học!");
  }
}

// Tìm kiếm theo tên khóa học
function searchMyCourses() {
  const keyword = document
    .getElementById("searchInput")
    .value.toLowerCase()
    .trim();
  const filtered = allCourses.filter((c) =>
    c.title.toLowerCase().includes(keyword)
  );
  renderMyCourses(filtered);
}
