importScripts('/_nuxt/workbox.6041bd81.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/0059627.js",
    "revision": "ea788609508d4a96fd2a3abf8f66f83f"
  },
  {
    "url": "/_nuxt/1c940f1.js",
    "revision": "9f71958a70cd0ecbe47b3838616680d4"
  },
  {
    "url": "/_nuxt/356a75a.js",
    "revision": "8cceb82b77024dff8b0e7f14b1e7e5d5"
  },
  {
    "url": "/_nuxt/38ef0cd.js",
    "revision": "7b5a28f1318e58ade23e5b340f5732c0"
  },
  {
    "url": "/_nuxt/46b1a50.js",
    "revision": "d31cbf03bd83c9373d431cd4c1684a5e"
  },
  {
    "url": "/_nuxt/7ae706c.js",
    "revision": "3a340614ceb327e47060daa400e7369d"
  },
  {
    "url": "/_nuxt/85808ec.js",
    "revision": "dbec692aaf0e0af47eed77accac9608b"
  },
  {
    "url": "/_nuxt/a0cc723.js",
    "revision": "02176244847760710dbdba3c56050a2f"
  },
  {
    "url": "/_nuxt/a697021.js",
    "revision": "fd35de8e58d2cab22e4d5af9c9d7a4a8"
  },
  {
    "url": "/_nuxt/ade3678.js",
    "revision": "d7d334e7ee3b48a03f94d3ba82e30921"
  },
  {
    "url": "/_nuxt/b4d7901.js",
    "revision": "b94004ed20d75c704e66d3d2bd0bc2c8"
  },
  {
    "url": "/_nuxt/d3bdb72.js",
    "revision": "c46241045721739379fa101fe6c1d29e"
  },
  {
    "url": "/_nuxt/e5da404.js",
    "revision": "0aa9bd92be4c0d9eec64f25219246880"
  },
  {
    "url": "/_nuxt/ea64bdc.js",
    "revision": "69303e17ed5d74ed07383db4d807a2e2"
  },
  {
    "url": "/_nuxt/f8c2dec.js",
    "revision": "d5d2fa3b9c76761a8e827491cc2da2c0"
  },
  {
    "url": "/_nuxt/fecccad.js",
    "revision": "9065bdda1a3e7f281bf2a90d5c211949"
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
