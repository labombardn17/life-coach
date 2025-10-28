// Service Worker - Offline Support with Firebase
const CACHE_NAME = 'life-coach-v3-firebase';
const BASE_PATH = '/life-coach/';
const urlsToCache = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'core.js',
  BASE_PATH + 'firebase-config.js',
  BASE_PATH + 'module-loader.js',
  BASE_PATH + 'ai-assistant.js',
  BASE_PATH + 'modules/overview.js',
  BASE_PATH + 'modules/today.js',
  BASE_PATH + 'modules/habits.js',
  BASE_PATH + 'modules/workout.js',
  BASE_PATH + 'modules/ibwork.js',
  BASE_PATH + 'modules/calendar.js',
  BASE_PATH + 'modules/crm.js',
  BASE_PATH + 'modules/learn.js',
  BASE_PATH + 'modules/notes.js',
  BASE_PATH + 'modules/goals.js',
  BASE_PATH + 'modules/manifestation.js',
  BASE_PATH + 'modules/motivation.js',
  BASE_PATH + 'modules/roadmap.js'
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
