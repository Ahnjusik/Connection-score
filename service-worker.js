const CACHE_NAME = 'connection-score-v2026-11';
const APP_URL = 'https://ahnjusik.github.io/Connection-score/';

const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.png'
];

importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCJvWHR4L7LtB1OneHBwhuSu_YwenIwq-k',
  authDomain: 'connection-score-management.firebaseapp.com',
  databaseURL: 'https://connection-score-management-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'connection-score-management',
  storageBucket: 'connection-score-management.firebasestorage.app',
  messagingSenderId: '989741595794',
  appId: '1:989741595794:web:80840e8e96310285eafa4b',
  measurementId: 'G-6DSMWPKPEF'
});

const messaging = firebase.messaging();

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

messaging.onBackgroundMessage((payload) => {
  const notif = payload.notification || {};
  const data = payload.data || {};
  const title = notif.title || data.title || '🎳 Bowling Connection 알림';
  const options = {
    body: notif.body || data.body || '새로운 소식이 등록되었습니다.',
    icon: './logo.png',
    badge: './logo.png',
    data: {
      url: (payload.fcmOptions && payload.fcmOptions.link) || data.url || APP_URL
    }
  };
  return self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || APP_URL;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.indexOf('Connection-score') !== -1 && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
