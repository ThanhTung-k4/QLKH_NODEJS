fetchAccounts();

async function fetchAccounts() {
  const tbody = document.getElementById("accountTable");
  if (!tbody) return;
  const res = await fetch(`${api}/users`);
  const users = await res.json();
  tbody.innerHTML = "";

  users.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.username}</td>
      <td><input value="${user.name}" id="name-${user.id}" /></td>
      <td>
        <select id="role-${user.id}">
          <option value="student" ${
            user.role === "student" ? "selected" : ""
          }>Sinh viên</option>
          <option value="admin" ${
            user.role === "admin" ? "selected" : ""
          }>Admin</option>
        </select>
      </td>
      <td>
        <button onclick="updateUser(${user.id})">Sửa</button>
        <button onclick="deleteUser(${user.id})">Xóa</button>
      </td>`;
    tbody.appendChild(row);
  });
}

async function updateUser(id) {
  const name = document.getElementById(`name-${id}`).value;
  const role = document.getElementById(`role-${id}`).value;
  await fetch(`${api}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, role }),
  });
  fetchAccounts();
}

async function deleteUser(id) {
  if (confirm("Bạn có chắc chắn muốn xóa?")) {
    await fetch(`${api}/users/${id}`, { method: "DELETE" });
    fetchAccounts();
  }
}
