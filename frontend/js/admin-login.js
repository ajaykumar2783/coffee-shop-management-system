async function adminLogin() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Enter username and password");
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("adminToken", data.token);
      alert("Login successful");
      window.location.href = "dashboard.html";
    } else {
      alert(data.error || "Invalid login");
    }
  } catch (error) {
    console.log(error);
    alert("Backend not running or API URL is wrong");
  }
}
