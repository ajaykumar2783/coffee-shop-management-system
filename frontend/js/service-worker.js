const CACHE_NAME = "brewnest-cache-v1";

const urlsToCache = [
  "index.html",
  "menu.html",
  "cart.html",
  "track-order.html",
  "admin-login.html",
  "css/style.css",
  "js/api.js",
  "js/menu.js",
  "js/cart.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request)),
  );
});
