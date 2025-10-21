const CACHE_NAME = "taskflow-v1";
// List of files that form the 'app shell' and should be aggressively cached
const urlsToCache = [
  "/",
  "./auth.html",
  "./dashboard.html",
  "./profile.html",
  "./index.html",
  // Include common CDN resources for offline availability (Tailwind, Lucide, Fonts)
  "https://cdn.tailwindcss.com",
  "https://unpkg.com/lucide@latest",
  "https://fonts.googleapis.com/css2?family=Inter:wght=100..900&display=swap",
];

// 1. Installation: Caching the App Shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[Service Worker] Caching app shell assets.");
        // We use fetch and add to cache to handle CDN requests correctly
        return cache.addAll(urlsToCache);
      })
      .catch((err) => console.error("[Service Worker] Failed to cache:", err))
  );
});

// 2. Activation: Cleaning up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("[Service Worker] Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. Fetch: Serving content from cache first (Cache-First strategy)
self.addEventListener("fetch", (event) => {
  // Only cache GET requests and non-API calls (to avoid caching dynamic data)
  const isApiCall = event.request.url.includes("/api/");
  if (event.request.method === "GET" && !isApiCall) {
    event.respondWith(
      caches
        .match(event.request)
        .then((response) => {
          // Return cache hit if found
          if (response) {
            return response;
          }
          // Fallback to network if not found
          return fetch(event.request);
        })
        .catch((err) => {
          console.warn(
            "[Service Worker] Fetch failed and no cache match for:",
            event.request.url,
            err
          );
          // Optionally serve a generic offline page here if needed
        })
    );
  }
});
