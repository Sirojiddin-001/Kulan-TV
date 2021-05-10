const cacheName = "ktv-v1";
const staticAssets = [
  "/",
  "./assets/css/style.min.css",
  "./assets/css/uikit.css",
  "./assets/css/video-js.css",
  "./assets/img/logo.png",
  "./assets/img/cover.png",
  "./assets/js/firebase.min.js",
  "./assets/js/hls.min.js",
  "./assets/js/main.js",
  "./assets/js/select.js",
  "./assets/js/uikit-icons.min.js",
  "./assets/js/uikit.min.js",
  "./assets/js/video.js",
  "./index.html",
  "./offline.html",
];

self.addEventListener("install", async () => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
});

self.addEventListener("activate", async () => {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames
      .filter((name) => name !== cacheName)
      .map((name) => caches.delete(name))
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (event.request.mode === "navigate") {
    return event.respondWith(
      fetch(event.request).catch(() => caches.match("./offline.html"))
    );
  }
  if (url.origin === location.origin) {
    event.respondWith(chacheFirst(request));
  }
});

async function chacheFirst(request) {
  const cached = await caches.match(request);
  return cached ?? (await fetch(request));
}
