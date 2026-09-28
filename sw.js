// 해성발전기 매출관리 - 홈 화면 설치용 서비스워커
// 항상 최신 파일을 먼저 받아오고(네트워크 우선), 인터넷이 끊겼을 때만 저장해 둔 화면을 보여줌.
// Firebase 등 다른 사이트로 가는 요청은 건드리지 않음.
const CACHE = "haesung-sales-v1";
self.addEventListener("install", e => { self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); return res; })
      .catch(() => caches.match(req).then(r => r || caches.match("./")))
  );
});
