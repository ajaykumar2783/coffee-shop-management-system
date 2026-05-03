let salesChart;
let popularChart;

function logoutAdmin() {
  localStorage.removeItem("adminToken");
  window.location.href = "admin-login.html";
}

async function loadDashboard(filter = "all") {
  const res = await fetch(`${API_BASE_URL}/dashboard?filter=${filter}`, {
    headers: {
      Authorization: "admin-token",
    },
  });

  const data = await res.json();

  document.getElementById("totalSales").innerText = `₹${data.total_sales}`;
  document.getElementById("totalOrders").innerText = data.total_orders;
  document.getElementById("pendingOrders").innerText = data.pending_orders;
  document.getElementById("completedOrders").innerText = data.completed_orders;

  renderSalesChart(data.daily_sales);
  renderPopularChart(data.popular_items);
}

function renderSalesChart(chartData) {
  const ctx = document.getElementById("salesChart");

  if (salesChart) salesChart.destroy();

  salesChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: chartData.labels,
      datasets: [
        {
          label: "Sales ₹",
          data: chartData.values,
          borderWidth: 3,
          tension: 0.4,
          fill: true,
        },
      ],
    },
  });
}

function renderPopularChart(chartData) {
  const ctx = document.getElementById("popularChart");

  if (popularChart) popularChart.destroy();

  popularChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: chartData.labels,
      datasets: [
        {
          label: "Quantity Sold",
          data: chartData.values,
          borderWidth: 2,
        },
      ],
    },
  });
}

async function loadOrders() {
  const res = await fetch(`${API_BASE_URL}/orders`);
  const orders = await res.json();

  const ordersList = document.getElementById("ordersList");
  ordersList.innerHTML = "";

  if (orders.length === 0) {
    ordersList.innerHTML = `<p class="empty-text">No orders yet.</p>`;
    return;
  }

  orders.forEach((order) => {
    const div = document.createElement("div");
    div.className = "order-card";

    div.innerHTML = `
      <div class="order-top">
        <div>
          <h3>Order #${order.id}</h3>
          <p>${order.customer_name} | ${order.phone}</p>
          <small>${order.created_at}</small>
          <p>Payment: ${order.payment_method}</p>
        </div>

        <select onchange="updateStatus(${order.id}, this.value)">
          <option ${order.status === "Pending" ? "selected" : ""}>Pending</option>
          <option ${order.status === "Preparing" ? "selected" : ""}>Preparing</option>
          <option ${order.status === "Completed" ? "selected" : ""}>Completed</option>
        </select>
      </div>

      <div class="order-items">
        ${order.items
          .map(
            (item) => `
              <p>${item.name} × ${item.quantity} 
              <strong>₹${item.subtotal}</strong></p>
            `,
          )
          .join("")}
      </div>

      <div class="order-total">
        Total: ₹${order.total_amount}
      </div>
    `;

    ordersList.appendChild(div);
  });
}

async function updateStatus(orderId, status) {
  await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  loadDashboard();
  loadOrders();
}

loadDashboard();
loadOrders();
