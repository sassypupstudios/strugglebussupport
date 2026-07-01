/**
 * Struggle Bus Support — Service Worker
 * Cache-first for static assets, network-first for everything else.
 * Enables offline browsing of previously visited pages.
 */

var CACHE = 'sbs-v4';
var STATIC = [
  '/',
  '/index.html',
  '/about.html',
  '/suggest.html',
  '/meetings.html',
  '/404.html',
  '/css/style.css',
  '/js/data.js',
  '/js/petcare-resources.js',
  '/js/union-resources.js',
  '/js/greenville-resources.js',
  '/js/cherokee-resources.js',
  '/js/main.js',
  '/js/translate.js',
  '/js/app.js',
  '/favicon.svg',
  '/manifest.json',
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(STATIC);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE; }).map(function (k) {
          return caches.delete(k);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  // Never cache API routes or admin
  var url = req.url;
  if (url.includes('/api/') || url.includes('/functions/') || url.includes('/admin')) return;

  e.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) return cached;
      return fetch(req).then(function (response) {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        var clone = response.clone();
        caches.open(CACHE).then(function (cache) { cache.put(req, clone); });
        return response;
      });
    }).catch(function () {
      return caches.match('/404.html');
    })
  );
});
