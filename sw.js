// 离线缓存：先用缓存打开，后台再取新版本，下次打开就是新版
var CACHE = "checkin-quest-v1";
var FILES = ["./", "index.html", "quest.html", "checkin.html", "manifest-quest.webmanifest", "manifest-checkin.webmanifest", "icon-quest-180.png", "icon-quest-192.png", "icon-quest-512.png", "icon-checkin-180.png", "icon-checkin-192.png", "icon-checkin-512.png"];
self.addEventListener("install", function(e){ e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(FILES); }).then(function(){ return self.skipWaiting(); })); });
self.addEventListener("activate", function(e){ e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); })); });
self.addEventListener("fetch", function(e){
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.match(e.request, {ignoreSearch:true}).then(function(hit){
    var net = fetch(e.request).then(function(res){ if (res && res.ok){ var copy = res.clone(); caches.open(CACHE).then(function(c){ c.put(e.request, copy); }); } return res; }).catch(function(){ return hit; });
    return hit || net;
  }));
});
