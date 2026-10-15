const CACHE='bey-lab-pwa-v40';
const ASSETS=['./','./index.html','./arena.html','./lab.html','./data.html','./records.html','./league.html','./bey-universal.css','./bey-universal.js','./bey-hands.js','./hands.html','./extra.html','./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req=event.request;
  if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
  // For pages, prefer the newest online version; keep offline support.
  if(req.mode==='navigate'){
    event.respondWith(fetch(req).then(response=>{
      if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(req,copy)))}
      return response;
    }).catch(()=>caches.match(req).then(cached=>cached||caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(response=>{
    if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(req,copy)))}
    return response;
  })));
});
