async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    // Nếu server trả lỗi HTML hoặc status khác 200, ta xử lý lỗi rõ ràng hơn
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Lỗi server: ${errText}`);
    }

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.name);
      localStorage.setItem("userId", data.id); // 🔧 Thêm dòng này

      if (data.role === "admin") {
        window.location.href = "admin-home.html";
      } else if (data.role === "student") {
        window.location.href = "student-home.html";
      } else {
        alert("Vai trò không hợp lệ!");
      }
    } else {
      alert(data.error || "Đăng nhập thất bại!");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Lỗi đăng nhập hoặc không kết nối được với server.");
  }
}
