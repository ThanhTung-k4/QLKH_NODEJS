async function fetchStudentRegistrations() {
  const container = document.querySelector(".page");
  container.innerHTML = `<h2><i class="fa-solid fa-user-graduate"></i> Danh sách khóa học</h2>`;

  try {
    const res = await fetch(`${api}/admin/registrations`);
    const data = await res.json();

    // Gom nhóm theo course_title
    const grouped = {};

    data.forEach((item) => {
      const title = item.course_title;
      if (!grouped[title]) {
        grouped[title] = [];
      }
      grouped[title].push({
        student_id: item.student_id,
        student_name: item.student_name,
        status: item.status,
      });
    });

    let index = 1;

    for (const courseTitle in grouped) {
      const students = grouped[courseTitle];

      const section = document.createElement("div");
      section.style.marginBottom = "20px";
      section.innerHTML = `
        <div style="padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
          <strong>${index++}. ${courseTitle}</strong> - ${
        students.length
      } sinh viên
          <button onclick="toggleDetails(this)">Xem chi tiết</button>
          <div class="details" style="display: none; margin-top: 10px;">
            <table class="styled-table">
              <thead>
                <tr>
                  <th>ID Sinh viên</th>
                  <th>Tên sinh viên</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                ${students
                  .map(
                    (s) => `
                  <tr>
                    <td>${s.student_id}</td>
                    <td>${s.student_name}</td>
                    <td style="color: ${
                      s.status === "completed" ? "green" : "red"
                    }">
                      ${
                        s.status === "completed"
                          ? "Hoàn thành"
                          : "Chưa hoàn thành"
                      }
                    </td>
                  </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
      container.appendChild(section);
    }
  } catch (err) {
    console.error("Lỗi tải danh sách:", err);
  }
}

// Toggle hiển thị/ẩn chi tiết
function toggleDetails(btn) {
  const details = btn.nextElementSibling;
  if (details.style.display === "none") {
    details.style.display = "block";
    btn.textContent = "Ẩn chi tiết";
  } else {
    details.style.display = "none";
    btn.textContent = "Xem chi tiết";
  }
}

fetchStudentRegistrations();
