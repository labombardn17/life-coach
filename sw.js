// Service Worker - Offline Support
const CACHE_NAME = 'life-coach-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/core.js',
  '/module-loader.js',
  '/ai-assistant.js',
  '/modules/overview.js',
  '/modules/today.js',
  '/modules/habits.js',
  '/modules/workout.js',
  '/modules/ibwork.js',
  '/modules/calendar.js',
  '/modules/crm.js',
  '/modules/learn.js',
  '/modules/notes.js',
  '/modules/goals.js',
  '/modules/manifestation.js',
  '/modules/motivation.js',
  '/modules/roadmap.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
