const CACHE='just-period-v8-complete-blue';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon.png','./log.html','./log-icon.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('just-period-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    if(event.request.mode==='navigate'){
      try{const response=await fetch(event.request);if(response.ok)cache.put(event.request,response.clone());return response}catch{return await cache.match(event.request)||await cache.match('./index.html')||Response.error()}
    }
    return await cache.match(event.request)||fetch(event.request);
  })());
});
