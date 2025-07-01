// admin-router.js
document.addEventListener("DOMContentLoaded", () => {
  const name = localStorage.getItem("name") || "Admin";
  document.getElementById("adminName").textContent = name;

  const contentDiv = document.getElementById("main-content");

  const loadPage = (page) => {
    fetch(`${page}.html`)
      .then((res) => res.text())
      .then((html) => {
        contentDiv.innerHTML = html;

        // Chạy lại các script trong trang được tải
        const scriptTags = contentDiv.querySelectorAll("script");
        scriptTags.forEach((oldScript) => {
          const newScript = document.createElement("script");
          newScript.textContent = oldScript.textContent;
          document.body.appendChild(newScript);
        });
      })
      .catch(() => {
        contentDiv.innerHTML = "<p>Không thể tải trang!</p>";
      });
  };

  // Gán sự kiện cho menu
  document.getElementById("nav-account").addEventListener("click", () => {
    loadPage("account-management");
  });

  document.getElementById("nav-course").addEventListener("click", () => {
    loadPage("course-management");
  });

  document.getElementById("nav-student").addEventListener("click", () => {
    loadPage("manage-students");
  });
});
