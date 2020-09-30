importScripts('/_nuxt/workbox.6041bd81.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/04eed28.js",
    "revision": "307b61c3edb51cbd71f9b1e45dfa7a9d"
  },
  {
    "url": "/_nuxt/3245407.js",
    "revision": "49f18c09cf9a132f9b9337a935b08036"
  },
  {
    "url": "/_nuxt/3713e6e.js",
    "revision": "9217462ad528c1f2eb6d07101591c756"
  },
  {
    "url": "/_nuxt/4d7e73c.js",
    "revision": "208d137ee5b93c413f2258de5ae25676"
  },
  {
    "url": "/_nuxt/4ec0d92.js",
    "revision": "932b8b34093d72aa242dec7117854cc1"
  },
  {
    "url": "/_nuxt/585d0ba.js",
    "revision": "e3bca16ae497c3648c524ba8fafceee0"
  },
  {
    "url": "/_nuxt/5ecbff4.js",
    "revision": "efcac318b9894b78f318482f08ef21cf"
  },
  {
    "url": "/_nuxt/780db89.js",
    "revision": "ebf883ecd6faa225ec3776d170d033ac"
  },
  {
    "url": "/_nuxt/7cdc6a8.js",
    "revision": "aaa0dcc2a49947b6f34005bb10d5b60e"
  },
  {
    "url": "/_nuxt/8ee6396.js",
    "revision": "64275e71b6fa893a39700119d264db10"
  },
  {
    "url": "/_nuxt/c21022c.js",
    "revision": "acd9f88d04b74ec0af6b36d523cdc242"
  },
  {
    "url": "/_nuxt/cc76c2c.js",
    "revision": "a771400e31aedf527242915403e31239"
  },
  {
    "url": "/_nuxt/e5eb224.js",
    "revision": "499c9a166a62edce2315a95fc4941ee3"
  },
  {
    "url": "/_nuxt/e9f7f77.js",
    "revision": "17b257a2129c826043b5eb2131bd6f41"
  },
  {
    "url": "/_nuxt/f1d2f14.js",
    "revision": "7ba80362f6a9559d2af6c019b0972465"
  },
  {
    "url": "/_nuxt/f3cc205.js",
    "revision": "6b67c35718304d85f9a605fa1b86b77f"
  }
], {
  "cacheId": "heg_dab_nuxt",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/.*'), workbox.strategies.networkFirst({}), 'GET')
