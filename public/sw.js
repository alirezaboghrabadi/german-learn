// GermanLearn Service Worker
// This service worker enables offline functionality and caching

const CACHE_NAME = 'german-learn-v1'
const STATIC_CACHE = 'german-learn-static-v1'
const DYNAMIC_CACHE = 'german-learn-dynamic-v1'

const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/offline',
  '/manifest.json',
  '/icons/icon-72.png',
  '/icons/icon-96.png',
  '/icons/icon-128.png',
  '/icons/icon-144.png',
  '/icons/icon-152.png',
  '/icons/icon-192.png',
  '/icons/icon-384.png',
  '/icons/icon-512.png',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return name !== STATIC_CACHE && name !== DYNAMIC_CACHE
          })
          .map((name) => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})

// Fetch event - network first with cache fallback
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return

  // Skip API calls
  if (event.request.url.includes('/api/')) {
    event.respondWith(networkFirstWithCache(event.request))
    return
  }

  // HTML pages - network first
  if (event.request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(networkFirstWithCache(event.request))
    return
  }

  // Static assets - cache first
  if (
    event.request.url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot)$/)
  ) {
    event.respondWith(cacheFirstWithNetwork(event.request))
    return
  }

  // Everything else - network first
  event.respondWith(networkFirstWithCache(event.request))
})

// Network first strategy
async function networkFirstWithCache(request) {
  try {
    const response = await fetch(request)
    const cache = await caches.open(DYNAMIC_CACHE)
    cache.put(request, response.clone())
    return response
  } catch (error) {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    // If it's a navigation request, show offline page
    if (request.mode === 'navigate') {
      const offlineResponse = await caches.match('/offline')
      if (offlineResponse) {
        return offlineResponse
      }
    }

    // Return a simple offline response
    return new Response(
      JSON.stringify({ offline: true, message: 'You are offline. Some features may be unavailable.' }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 503,
      }
    )
  }
}

// Cache first strategy
async function cacheFirstWithNetwork(request) {
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    // Update cache in background
    fetch(request).then((response) => {
      if (response) {
        const cache = caches.open(DYNAMIC_CACHE)
        cache.then((c) => c.put(request, response))
      }
    }).catch(() => {})
    return cachedResponse
  }

  try {
    const response = await fetch(request)
    const cache = await caches.open(DYNAMIC_CACHE)
    cache.put(request, response.clone())
    return response
  } catch (error) {
    return new Response('Offline', { status: 503 })
  }
}

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-study-data') {
    event.waitUntil(syncStudyData())
  } else if (event.tag === 'sync-progress') {
    event.waitUntil(syncProgress())
  }
})

async function syncStudyData() {
  const cache = await caches.open('pending-data')
  const requests = await cache.keys()

  for (const request of requests) {
    try {
      const response = await fetch(request)
      if (response.ok) {
        await cache.delete(request)
      }
    } catch (error) {
      console.error('Sync failed for:', request.url)
    }
  }
}

async function syncProgress() {
  // Sync user progress when back online
  try {
    const pendingData = localStorage.getItem('pendingProgress')
    if (pendingData) {
      const data = JSON.parse(pendingData)
      await fetch('/api/sync-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      localStorage.removeItem('pendingProgress')
    }
  } catch (error) {
    console.error('Progress sync failed:', error)
  }
}

// Push notification handler
self.addEventListener('push', (event) => {
  if (!event.data) return

  try {
    const data = event.data.json()

    const options = {
      title: data.title || 'GermanLearn',
      body: data.body || '',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
      vibrate: [200, 100, 200],
      data: {
        url: data.url || '/dashboard',
      },
      actions: [
        {
          action: 'open',
          title: 'Open',
        },
        {
          action: 'close',
          title: 'Dismiss',
        },
      ],
    }

    event.waitUntil(
      self.registration.showNotification(data.title || 'GermanLearn', options)
    )
  } catch (error) {
    console.error('Push notification error:', error)
  }
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'close') return

  const url = event.notification.data?.url || '/dashboard'

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      const existingClient = windowClients.find((client) => client.url === url)
      if (existingClient) {
        existingClient.focus()
      } else {
        clients.openWindow(url)
      }
    })
  )
})
