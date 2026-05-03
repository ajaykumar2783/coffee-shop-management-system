let lastOrderCount = 0;

function logoutAdmin() {
  localStorage.removeItem("adminToken");
  window.location.href = "admin-login.html";
}

async function loadKitchenOrders() {
  const res = await fetch(`${API_BASE_URL}/orders`);
  const orders = await res.json();

  if (orders.length > lastOrderCount && lastOrderCount !== 0) {
    document.getElementById("notifySound").play();
  }

  lastOrderCount = orders.length;

  const box = document.getElementById("kitchenOrders");
  box.innerHTML = "";

  orders
    .filter((order) => order.status !== "Completed")
    .forEach((order) => {
      box.innerHTML += `
        <div class="order-card kitchen-card">
          <h2>Order #${order.id}</h2>
          <p>${order.customer_name} | ${order.phone}</p>
          <p>Table: ${order.table_no}</p>
          <p>Payment: ${order.payment_method}</p>

          <div class="order-items">
            ${order.items
              .map(
                (item) => `
              <p>${item.name} × ${item.quantity}</p>
            `,
              )
              .join("")}
          </div>

          <div class="kitchen-actions">
            <button onclick="updateStatus(${order.id}, 'Preparing')">Preparing</button>
            <button onclick="updateStatus(${order.id}, 'Completed')">Completed</button>
          </div>
        </div>
      `;
    });
}

async function updateStatus(id, status) {
  await fetch(`${API_BASE_URL}/orders/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "admin-token",
    },
    body: JSON.stringify({ status }),
  });

  loadKitchenOrders();
}

loadKitchenOrders();
setInterval(loadKitchenOrders, 5000);
