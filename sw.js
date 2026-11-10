/* 지판 메이드 2: 오프라인에서도 열리게 파일을 저장해 둔다. 온라인이면 새 버전을 받아 다음에 열 때 반영한다. */
const CACHE='jipan-maid-2';
const FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.open(CACHE).then(c=>c.match(e.request).then(hit=>{
    const net=fetch(e.request).then(r=>{if(r&&(r.ok||r.type==='opaque'))c.put(e.request,r.clone());return r;}).catch(()=>hit);
    return hit||net;
  })));
});
