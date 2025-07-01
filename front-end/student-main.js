window.addEventListener("DOMContentLoaded", () => {
  const studentName = localStorage.getItem("name") || "sinh viên";
  const nameElement = document.getElementById("studentName");
  if (nameElement) {
    nameElement.textContent = studentName;
  }

  // Gắn sự kiện click cho menu
  document.getElementById("nav-register").addEventListener("click", () => {
    setActive("nav-register");
    loadPage("available-courses.html", "available-courses.js", "fetchCourses");
  });

  document.getElementById("nav-my-courses").addEventListener("click", () => {
    setActive("nav-my-courses");
    loadPage("my-courses.html", "my-courses.js", "fetchMyCourses");
  });

  // Thêm sự kiện click cho nút Đăng xuất
  document.getElementById("nav-logout").addEventListener("click", () => {
    // Xóa thông tin đăng nhập (ví dụ: xóa name từ localStorage)
    localStorage.removeItem("name");
    // Hiển thị thông báo và chuyển hướng về trang login
    alert("Bạn đã đăng xuất thành công!");
    window.location.href = "login.html";
  });

  // Mặc định mở "Khóa học đã đăng ký"
  setActive("nav-my-courses");
  loadPage("my-courses.html", "my-courses.js", "fetchMyCourses");
});

// Gán class active cho menu được chọn
function setActive(id) {
  document
    .querySelectorAll(".sidebar li")
    .forEach((li) => li.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// Load trang và script tương ứng
function loadPage(htmlPage, jsFile, callbackName) {
  fetch(htmlPage)
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("main-content").innerHTML = html;

      // Xoá script cũ nếu đã nạp
      const oldScript = document.querySelector(`script[data-dynamic]`);
      if (oldScript) oldScript.remove();

      // Tạo script mới
      const script = document.createElement("script");
      script.src = jsFile;
      script.setAttribute("data-dynamic", "true");
      script.onload = () => {
        if (typeof window[callbackName] === "function") {
          window[callbackName]();
        } else {
          console.warn(`Không tìm thấy hàm ${callbackName}`);
        }
      };
      document.body.appendChild(script);
    })
    .catch((err) => console.error("Lỗi load trang:", err));
}
