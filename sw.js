// ケア記録アプリ Service Worker
const CACHE_NAME = 'care-record-v1';

// キャッシュするファイル
const ASSETS = [
  './index.html',
  './manifest.json',
];

// インストール時にキャッシュ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// 古いキャッシュを削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ネットワーク優先・失敗時はキャッシュを返す
self.addEventListener('fetch', event => {
  // Firebase や CDN へのリクエストはキャッシュしない
  const url = new URL(event.request.url);
  if (
    url.hostname.includes('firebase') ||
    url.hostname.includes('googleapis') ||
    url.hostname.includes('gstatic') ||
    url.hostname.includes('jsdelivr') ||
    url.hostname.includes('fonts.g')
  ) {
    return; // ブラウザに任せる
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // 成功したらキャッシュにも保存
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => {
        // オフライン時はキャッシュを返す
        return caches.match(event.request);
      })
  );
});
