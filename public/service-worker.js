/* eslint-env serviceworker */

// Force the new service worker to activate.
self.addEventListener('install', (event) => {
  self.skipWaiting()
})

// Force all pages to immediately be controlled
// by the updated service worker.
self.addEventListener('activate', (event) => {
  self.clients.claim()
})

respondWith('/api', {
  body: {
    foo: 'bar',
    woot: true
  },
  delay: 2000
})

respondWith('/api/fail', {
  body: {
    message: 'Oh, no!'
  },
  delay: 200,
  status: 500
})

function respondWith (path, options = {}) {
  const { delay = 0, status = 200, type = 'json' } = options
  const body = getBody({ body: options.body, type })
  const headers = getHeaders(type)
  self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url)
    if (url.pathname === path) {
      event.respondWith((async () => {
        await sleep(delay)
        return new Response(body, { headers, status })
      })())
    }
  })
}

function getBody (options) {
  const { body, type } = options
  if (type === 'json') {
    return JSON.stringify(body)
  }
  return body
}

function getHeaders (type) {
  const types = {
    json: 'application/json',
    text: 'text/plain'
  }
  if (types[type]) {
    return {
      'Content-Type': types[type]
    }
  }
  return null
}

function sleep (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
