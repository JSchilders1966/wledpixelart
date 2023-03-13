self.addEventListener('install', (e) => {
    e.waitUntil(
      caches.open('wleddesigner').then((cache) => cache.addAll([
        '/',
        'icon/program.png',
        'icon/favicon.ico',
        'index.html',
        'script.js',
        'style.css',
        'bootstrap.min.css',
        'html2canvas.min.js',
        'jquery.min.js',
      ])),
    );
  });
  
  self.addEventListener('fetch', (e) => {
    console.log(e.request.url);
    e.respondWith(
      caches.match(e.request).then((response) => response || fetch(e.request)),
    );
  });