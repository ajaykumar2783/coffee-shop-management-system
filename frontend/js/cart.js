const cartItems = document.getElementById("cartItems");
const totalAmount = document.getElementById("totalAmount");
let latestOrder = null;

function loadCart() {
  const cart = JSON.parse(localStorage.getItem("coffeeCart")) || [];

  updateCartCount();
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <h2>Your cart is empty 🛒</h2>
        <p>Add coffee items from menu page.</p>
        <a href="menu.html" class="btn primary">Go To Menu</a>
      </div>
    `;
    totalAmount.innerText = "₹0";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    total += Number(item.price) * Number(item.quantity);

    const div = document.createElement("div");
    div.className = "cart-item slide-cart";

    div.innerHTML = `
      <div>
        <h3>${item.name}</h3>
        <p>₹${item.price} × ${item.quantity}</p>
      </div>

      <div class="cart-actions">
        <button onclick="decreaseQty(${index})">-</button>
        <span>${item.quantity}</span>
        <button onclick="increaseQty(${index})">+</button>
        <button class="remove" onclick="removeItem(${index})">Delete</button>
      </div>
    `;

    cartItems.appendChild(div);
  });

  totalAmount.innerText = `₹${total}`;
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("coffeeCart")) || [];
  const count = cart.reduce((sum, item) => sum + Number(item.quantity), 0);

  const cartCount = document.getElementById("cartCount");
  if (cartCount) cartCount.innerText = count;
}

function increaseQty(index) {
  let cart = JSON.parse(localStorage.getItem("coffeeCart")) || [];
  cart[index].quantity += 1;
  localStorage.setItem("coffeeCart", JSON.stringify(cart));
  loadCart();
}

function decreaseQty(index) {
  let cart = JSON.parse(localStorage.getItem("coffeeCart")) || [];

  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    cart.splice(index, 1);
  }

  localStorage.setItem("coffeeCart", JSON.stringify(cart));
  loadCart();
}

function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("coffeeCart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("coffeeCart", JSON.stringify(cart));
  loadCart();
}

async function placeOrder() {
  const cart = JSON.parse(localStorage.getItem("coffeeCart")) || [];

  const customerName = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const tableNo = document.getElementById("tableNo").value.trim() || "Takeaway";
  const paymentMethod = document.querySelector(
    "input[name='payment']:checked",
  ).value;

  if (!customerName || !phone) {
    alert("Please enter customer name and phone number");
    return;
  }

  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0,
  );

  const orderData = {
    customer_name: customerName,
    phone,
    table_no: tableNo,
    payment_method: paymentMethod,
    total_amount: total,
    items: cart,
  };

  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  const data = await res.json();

  if (res.ok) {
    latestOrder = data.order;

    localStorage.removeItem("coffeeCart");
    loadCart();

    document.getElementById("afterOrderActions").innerHTML = `
      <div class="success-box">
        <h3>Order Placed Successfully ✅</h3>
        <p>Your Order ID: <strong>#${latestOrder.id}</strong></p>

        <button class="btn secondary full" onclick="downloadInvoice()">
          Download PDF Invoice
        </button>

        <button class="btn primary full" onclick="sendWhatsAppOrder()">
          Send Order To WhatsApp
        </button>

        <a class="btn secondary full" href="track-order.html">
          Track Order
        </a>
      </div>
    `;
  } else {
    alert("Failed to place order");
  }
}

function downloadInvoice() {
  if (!latestOrder) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text("BrewNest Coffee Invoice", 20, 20);

  doc.setFontSize(12);
  doc.text(`Order ID: #${latestOrder.id}`, 20, 35);
  doc.text(`Customer: ${latestOrder.customer_name}`, 20, 45);
  doc.text(`Phone: ${latestOrder.phone}`, 20, 55);
  doc.text(`Table: ${latestOrder.table_no}`, 20, 65);
  doc.text(`Payment: ${latestOrder.payment_method}`, 20, 75);
  doc.text(`Date: ${latestOrder.created_at}`, 20, 85);

  let y = 105;

  latestOrder.items.forEach((item) => {
    doc.text(`${item.name} x ${item.quantity} = Rs.${item.subtotal}`, 20, y);
    y += 10;
  });

  doc.setFontSize(16);
  doc.text(`Total: Rs.${latestOrder.total_amount}`, 20, y + 10);

  doc.save(`invoice_order_${latestOrder.id}.pdf`);
}

function sendWhatsAppOrder() {
  if (!latestOrder) return;

  const cafeWhatsAppNumber = "919999999999";

  let message = `New Coffee Order%0A`;
  message += `Order ID: #${latestOrder.id}%0A`;
  message += `Customer: ${latestOrder.customer_name}%0A`;
  message += `Phone: ${latestOrder.phone}%0A`;
  message += `Payment: ${latestOrder.payment_method}%0A`;
  message += `Total: ₹${latestOrder.total_amount}%0A%0A`;
  message += `Items:%0A`;

  latestOrder.items.forEach((item) => {
    message += `${item.name} x ${item.quantity} = ₹${item.subtotal}%0A`;
  });

  window.open(`https://wa.me/${cafeWhatsAppNumber}?text=${message}`, "_blank");
}

loadCart();
function showPaymentSuccess() {
  const popup = document.createElement("div");
  popup.className = "payment-popup";

  popup.innerHTML = `
    <div class="payment-box">
      <h1>✅ Payment Successful</h1>
      <p>Your order has been placed successfully.</p>
    </div>
  `;

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 2500);
}
function downloadInvoice() {
  if (!latestOrder) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFillColor(255, 138, 0);
  doc.rect(0, 0, 210, 35, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text("BrewNest Coffee", 20, 20);

  doc.setFontSize(12);
  doc.text("Premium Coffee Invoice", 20, 29);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);

  doc.text(`Invoice No: INV-${latestOrder.id}`, 20, 50);
  doc.text(`Order ID: #${latestOrder.id}`, 20, 60);
  doc.text(`Customer: ${latestOrder.customer_name}`, 20, 70);
  doc.text(`Phone: ${latestOrder.phone}`, 20, 80);
  doc.text(`Table: ${latestOrder.table_no}`, 20, 90);
  doc.text(`Payment: ${latestOrder.payment_method}`, 20, 100);
  doc.text(`Date: ${latestOrder.created_at}`, 20, 110);

  let y = 130;

  doc.setFontSize(14);
  doc.text("Item", 20, y);
  doc.text("Qty", 110, y);
  doc.text("Amount", 150, y);

  y += 8;
  doc.line(20, y, 190, y);
  y += 10;

  latestOrder.items.forEach((item) => {
    doc.setFontSize(12);
    doc.text(item.name, 20, y);
    doc.text(String(item.quantity), 115, y);
    doc.text(`Rs.${item.subtotal}`, 150, y);
    y += 10;
  });

  y += 8;
  doc.line(20, y, 190, y);
  y += 12;

  const gst = latestOrder.total_amount * 0.05;
  const grandTotal = latestOrder.total_amount + gst;

  doc.text(`Subtotal: Rs.${latestOrder.total_amount}`, 130, y);
  y += 10;
  doc.text(`GST 5%: Rs.${gst.toFixed(2)}`, 130, y);
  y += 10;

  doc.setFontSize(15);
  doc.text(`Grand Total: Rs.${grandTotal.toFixed(2)}`, 130, y);

  y += 25;
  doc.setFontSize(12);
  doc.text("Thank you for choosing BrewNest Coffee!", 20, y);

  doc.save(`BrewNest_Invoice_${latestOrder.id}.pdf`);
}
