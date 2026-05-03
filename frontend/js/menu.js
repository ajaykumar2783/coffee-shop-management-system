const menuGrid = document.getElementById("menuGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

let allItems = [];

async function loadMenu() {
  const res = await fetch(`${API_BASE_URL}/menu`);
  allItems = await res.json();

  renderMenu(allItems);
  updateCartCount();
}

function renderMenu(items) {
  menuGrid.innerHTML = "";

  if (items.length === 0) {
    menuGrid.innerHTML = `<h2 class="empty-text">No items found</h2>`;
    return;
  }

  items.forEach((item, index) => {
    const wishlist = JSON.parse(localStorage.getItem("coffeeWishlist")) || [];
    const isWishlisted = wishlist.some((w) => w.id === item.id);

    const card = document.createElement("div");
    card.className = "menu-card menu-animate";
    card.style.animationDelay = `${index * 0.08}s`;

    card.innerHTML = `
      <div class="menu-img">
        <img src="${item.image}" alt="${item.name}">
        <span>${item.badge}</span>

        <button class="wish-btn ${isWishlisted ? "active" : ""}" onclick='toggleWishlist(${JSON.stringify(item)})'>
          ${isWishlisted ? "❤️" : "🤍"}
        </button>
      </div>

      <div class="menu-content">
        <div class="rating">⭐ ${item.rating}</div>

        <h3>${item.name}</h3>
        <p>${item.category}</p>

        <div class="menu-footer">
          <strong>₹${item.price}</strong>

          <button class="add-btn" onclick='addToCart(${JSON.stringify(item)})'>
            + Add to Cart
          </button>
        </div>
      </div>
    `;

    menuGrid.appendChild(card);
  });
}

function filterMenu() {
  const search = searchInput.value.toLowerCase();
  const category = categoryFilter.value;

  let filtered = allItems.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search);

    const matchCategory = category === "All" || item.category === category;

    return matchSearch && matchCategory;
  });

  renderSuggestions(search);
  renderMenu(filtered);
}

function renderSuggestions(search) {
  let oldBox = document.querySelector(".suggestion-box");
  if (oldBox) oldBox.remove();

  if (!search) return;

  const matches = allItems
    .filter((item) => item.name.toLowerCase().includes(search))
    .slice(0, 5);

  if (matches.length === 0) return;

  const box = document.createElement("div");
  box.className = "suggestion-box";

  box.innerHTML = matches
    .map(
      (item) => `
      <div onclick="selectSuggestion('${item.name}')">
        ☕ ${item.name}
      </div>
    `,
    )
    .join("");

  searchInput.parentElement.appendChild(box);
}

function selectSuggestion(name) {
  searchInput.value = name;
  filterMenu();

  const box = document.querySelector(".suggestion-box");
  if (box) box.remove();
}

function addToCart(item) {
  let cart = JSON.parse(localStorage.getItem("coffeeCart")) || [];

  const existing = cart.find((i) => i.id === item.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      quantity: 1,
    });
  }

  localStorage.setItem("coffeeCart", JSON.stringify(cart));
  updateCartCount();
  showToast(`${item.name} added to cart 🛒`);
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("coffeeCart")) || [];
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartCount = document.getElementById("cartCount");
  if (cartCount) cartCount.innerText = count;
}

function toggleWishlist(item) {
  let wishlist = JSON.parse(localStorage.getItem("coffeeWishlist")) || [];

  const existing = wishlist.find((w) => w.id === item.id);

  if (existing) {
    wishlist = wishlist.filter((w) => w.id !== item.id);
    showToast("Removed from wishlist");
  } else {
    wishlist.push(item);
    showToast("Added to wishlist ❤️");
  }

  localStorage.setItem("coffeeWishlist", JSON.stringify(wishlist));
  filterMenu();
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 1800);
}

searchInput.addEventListener("input", filterMenu);
categoryFilter.addEventListener("change", filterMenu);

loadMenu();
