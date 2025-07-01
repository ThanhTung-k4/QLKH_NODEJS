document.getElementById("adminName").textContent =
  localStorage.getItem("name") || "Admin";

function loadPage(page) {
  const contentDiv = document.getElementById("main-content");
  fetch(`${page}.html`)
    .then((res) => res.text())
    .then((html) => {
      contentDiv.innerHTML = html;

      // Tải script tương ứng nếu có
      const script = document.createElement("script");
      script.src = `${page}.js`; // Ví dụ: account-management.js
      document.body.appendChild(script);
    })
    .catch(() => {
      contentDiv.innerHTML = "<p>Không thể tải trang!</p>";
    });
}

document
  .getElementById("nav-account")
  .addEventListener("click", () => loadPage("account-management"));
document
  .getElementById("nav-course")
  .addEventListener("click", () => loadPage("course-management"));
document
  .getElementById("nav-student")
  .addEventListener("click", () => loadPage("manage-students"));

// Thêm sự kiện cho nút Đăng xuất
document.getElementById("nav-logout").addEventListener("click", () => {
  // Xóa thông tin đăng nhập (ví dụ: xóa name từ localStorage)
  localStorage.removeItem("name");
  // Hiển thị thông báo và chuyển hướng về trang login
  alert("Bạn đã đăng xuất thành công!");
  window.location.href = "login.html";
});
