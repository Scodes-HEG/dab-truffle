importScripts('/_nuxt/workbox.6041bd81.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/05f6dd0.js",
    "revision": "982ffe96788093a9e8d2d40e49768e4a"
  },
  {
    "url": "/_nuxt/1147053.js",
    "revision": "06f0c75283fcd1d24a837108d945dfdf"
  },
  {
    "url": "/_nuxt/1789afa.js",
    "revision": "6d9f15a27d94ee8840ed4188c82c6ce2"
  },
  {
    "url": "/_nuxt/42794db.js",
    "revision": "599e24c9c5d4226379568d8332e9b8a7"
  },
  {
    "url": "/_nuxt/5eb58a0.js",
    "revision": "e1eba2ea933c2e00a4620dccf629db13"
  },
  {
    "url": "/_nuxt/67a237c.js",
    "revision": "45aa746d06a8d0224e31b0f85ae18612"
  },
  {
    "url": "/_nuxt/712006c.js",
    "revision": "a9687a18390d7db37422a4ddceaa0643"
  },
  {
    "url": "/_nuxt/7de5466.js",
    "revision": "6e41636525117c6f456fb4d0a829431e"
  },
  {
    "url": "/_nuxt/8cc06f1.js",
    "revision": "c66d93256e0b9ca6c7e3c610f312a889"
  },
  {
    "url": "/_nuxt/8ebbb91.js",
    "revision": "6589546440009306e5f0a9c744a419ac"
  },
  {
    "url": "/_nuxt/91be00f.js",
    "revision": "c4b0b83aeec4901d80bc28dc6adc2e14"
  },
  {
    "url": "/_nuxt/b7a6b9c.js",
    "revision": "324ab7ea938ae4eb8ae8f3f15429bd40"
  },
  {
    "url": "/_nuxt/c45042c.js",
    "revision": "a5f0b4c8d3e56405d6f370291d9996c8"
  },
  {
    "url": "/_nuxt/eba85e1.js",
    "revision": "40afe95ff4dfc44e9cd8826a45fc2cd9"
  },
  {
    "url": "/_nuxt/ebabcde.js",
    "revision": "78a294aa0eb60a3d0f39a37b685be31c"
  },
  {
    "url": "/_nuxt/f11ad06.js",
    "revision": "47f4ee0a684fdb38be19f3f557a843a5"
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
