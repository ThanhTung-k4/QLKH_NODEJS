async function fetchMyCourses() {
  const api = "http://localhost:3000";
  const studentId = localStorage.getItem("userId");
  const res = await fetch(`${api}/registrations?studentId=${studentId}`);
  const data = await res.json();

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
      </td>`;
    tbody.appendChild(row);
  });
}

async function markCompleted(regId) {
  const res = await fetch(`http://localhost:3000/registrations/${regId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "completed" }),
  });
  fetchMyCourses();
}
