let lastTrackedOrder = null;

async function trackOrder() {
  const orderId = document.getElementById("orderId").value;
  const phone = document.getElementById("phone").value;

  if (!orderId || !phone) return;

  const res = await fetch(`${API_BASE_URL}/orders/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order_id: orderId, phone }),
  });

  const result = document.getElementById("trackingResult");

  if (!res.ok) {
    result.innerHTML = `<div class="track-card"><h2>Order not found</h2></div>`;
    return;
  }

  const order = await res.json();
  lastTrackedOrder = { orderId, phone };

  const steps = ["Pending", "Preparing", "Completed"];
  const currentIndex = steps.indexOf(order.status);

  result.innerHTML = `
    <div class="track-card">
      <h2>Order #${order.id}</h2>
      <p>Name: ${order.customer_name}</p>
      <p>Total: ₹${order.total_amount}</p>
      <p>Status updates automatically every 5 seconds</p>

      <div class="tracking-steps">
        ${steps
          .map(
            (step, index) => `
          <div class="step ${index <= currentIndex ? "active" : ""}">
            <span>${index + 1}</span>
            <p>${step}</p>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
  `;
}

setInterval(() => {
  if (lastTrackedOrder) trackOrder();
}, 5000);
