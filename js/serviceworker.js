const version = "1.0.0";
const cacheName = `OndeTemPraVer-${version}`;
 
self.addEventListener('install', e => {
    e.waitUntil(
      caches.open(cacheName).then(cache => {
        return cache.addAll([
          `/`,
          `/index.html`,
          `/css/dashboard.css`,
          `/css/style.css`,
          `/js/home.js`,
          `/js/dashboard.js`,
          `/js/login.js`, 
          `/images/movie-roll.jpg`, 
          `/images/no_user.png`, 
          `/images/icons/house-home.jpg`,      
          `/images/icons/squares.png`      
        ])
            .then(() => self.skipWaiting());
      })
    );
  });

  self.addEventListener('activate', event => {
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
      }).then(cachesToDelete => {
        return Promise.all(cachesToDelete.map(cacheToDelete => {
          return caches.delete(cacheToDelete);
        }));
      }).then(() => self.clients.claim())
    );
  });
  
  self.addEventListener('fetch', event => {
    if (event.request.url.startsWith(self.location.origin)) {
      event.respondWith(
        caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
  
          return caches.open(RUNTIME).then(cache => {
            return fetch(event.request).then(response => {
              // Put a copy of the response in the runtime cache.
              return cache.put(event.request, response.clone()).then(() => {
                return response;
              });
            });
          });
        })
      );
    }
  });
  