// Service worker : recoit les notifications meme telephone verrouille / page fermee
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let d = { title: "ESP32-CAM", body: "Bouton appuye !" };
  try { d = event.data.json(); } catch (e) {}
  event.waitUntil((async () => {
    await self.registration.showNotification(d.title, {
      body: d.body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: "bouton",
      renotify: true,
      requireInteraction: true,
      vibrate: [300, 150, 300, 150, 300],
    });
    const list = await self.clients.matchAll({ type: "window" });
    list.forEach((c) => c.postMessage("beep"));
  })());
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil((async () => {
    const list = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    if (list.length) return list[0].focus();
    return self.clients.openWindow("/");
  })());
});
