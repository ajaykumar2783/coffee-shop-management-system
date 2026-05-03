const adminMenuGrid = document.getElementById("adminMenuGrid");

async function loadAdminMenu() {
  const res = await fetch(`${API_BASE_URL}/menu`);
  const items = await res.json();

  adminMenuGrid.innerHTML = "";

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "menu-card";

    card.innerHTML = `
      <div class="menu-img">
        <img src="${item.image}" alt="${item.name}">
        <span>${item.badge}</span>
      </div>

      <div class="menu-content">
        <h3>${item.name}</h3>
        <p>${item.category}</p>
        <strong>₹${item.price}</strong>

        <div class="admin-actions">
          <button onclick='editItem(${JSON.stringify(item)})'>Edit</button>
          <button class="delete-btn" onclick="deleteItem(${item.id})">Delete</button>
        </div>
      </div>
    `;

    adminMenuGrid.appendChild(card);
  });
}

async function saveMenuItem() {
  const itemId = document.getElementById("itemId").value;

  const data = {
    name: document.getElementById("name").value,
    category: document.getElementById("category").value,
    price: Number(document.getElementById("price").value),
    image: document.getElementById("image").value,
    rating: Number(document.getElementById("rating").value),
    badge: document.getElementById("badge").value,
  };

  if (!data.name || !data.category || !data.price || !data.image) {
    alert("Please fill required fields");
    return;
  }

  const url = itemId
    ? `${API_BASE_URL}/menu/${itemId}`
    : `${API_BASE_URL}/menu`;

  const method = itemId ? "PUT" : "POST";

  await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  clearForm();
  loadAdminMenu();
}

function editItem(item) {
  document.getElementById("itemId").value = item.id;
  document.getElementById("name").value = item.name;
  document.getElementById("category").value = item.category;
  document.getElementById("price").value = item.price;
  document.getElementById("image").value = item.image;
  document.getElementById("rating").value = item.rating;
  document.getElementById("badge").value = item.badge;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteItem(id) {
  if (!confirm("Delete this item?")) return;

  await fetch(`${API_BASE_URL}/menu/${id}`, {
    method: "DELETE",
  });

  loadAdminMenu();
}

function clearForm() {
  document.getElementById("itemId").value = "";
  document.getElementById("name").value = "";
  document.getElementById("category").value = "";
  document.getElementById("price").value = "";
  document.getElementById("image").value = "";
  document.getElementById("rating").value = "";
  document.getElementById("badge").value = "";
}

loadAdminMenu();