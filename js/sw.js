self.addEventListener('install', (e) => {
    e.waitUntil(
      caches.open('10fastfingers-offline').then((cache) => cache.addAll([
        '/management/',
        '/management/icon.png',
        '/management/logo.svg',
        '/management/user.svg',
        '/management/index.html',
        '/management/contents/cashbook.html',
        '/management/contents/changePassword.html',
        '/management/contents/dashboard.html',
        '/management/contents/debit-credit.html',
        '/management/contents/home.html',
        '/management/contents/it-services.html',
        '/management/css/dashboard.css',
        '/management/css/login.css',
        '/management/js/cashbook.js',
        '/management/js/changePassword.js',
        '/management/js/credit.js',
        '/management/js/debit.js',
        '/management/js/home.js',
        '/management/js/it-services.js',
        '/management/js/login.js'
      ])),
    );
  });
  
  self.addEventListener('fetch', (e) => {
    console.log(e.request.url);
    e.respondWith(
      caches.match(e.request).then((response) => response || fetch(e.request)),
    );
  });
  
  self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') {
        self.skipWaiting();
    }
  });