importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/061b3db.js",
    "revision": "38e5cf7e14f2d1ae54d6995bf34019c1"
  },
  {
    "url": "/_nuxt/15a0800.js",
    "revision": "fe405b9ea0f0793c773fe0203a8223a9"
  },
  {
    "url": "/_nuxt/16bb613.js",
    "revision": "25b8181f55f72593fcfe2cc40070bef7"
  },
  {
    "url": "/_nuxt/20418ac.js",
    "revision": "8b983b17534938fa228cbc1e1998da95"
  },
  {
    "url": "/_nuxt/239332e.js",
    "revision": "29057f1ef84ef448ff242915a6dbb2d1"
  },
  {
    "url": "/_nuxt/37f11e2.js",
    "revision": "ef82e6977b961e18edf7a357514b1e9c"
  },
  {
    "url": "/_nuxt/3fe2a30.js",
    "revision": "7f61e912a36e072678058d3b91540d3d"
  },
  {
    "url": "/_nuxt/40e2db7.js",
    "revision": "e05c1690751cda0b8a658a81b49463cb"
  },
  {
    "url": "/_nuxt/5162b27.js",
    "revision": "cc0b81b5faa5bca7107805a0434239a5"
  },
  {
    "url": "/_nuxt/5eac740.js",
    "revision": "d0c1d1af162d7fc40a3b69acb2cdd9ac"
  },
  {
    "url": "/_nuxt/6b24d7e.js",
    "revision": "840b232db042b2569dfb90b85cc408c0"
  },
  {
    "url": "/_nuxt/9bf8b6c.js",
    "revision": "7c9ee169146ad0768eaedd6db7e92d5a"
  },
  {
    "url": "/_nuxt/aad51dd.js",
    "revision": "33732a57e908fa3ec7752ab76221edd8"
  },
  {
    "url": "/_nuxt/af90c2b.js",
    "revision": "c955e05e0d56e5daaaa0e61febeff693"
  },
  {
    "url": "/_nuxt/b0865aa.js",
    "revision": "9b246b01519fd05b859897e23e01881f"
  },
  {
    "url": "/_nuxt/ca2f07f.js",
    "revision": "de6399a7430db203c384bf9cd2d18056"
  },
  {
    "url": "/_nuxt/d22572f.js",
    "revision": "e5938bb1753a819202d1d6f8b52301ca"
  }
], {
  "cacheId": "heg_dab_truffle",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/.*'), workbox.strategies.networkFirst({}), 'GET')
