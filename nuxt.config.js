export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  server: {
    port: process.env.SERVER_PORT || 3000, // par défaut: 3001
    host: process.env.SERVER_HOST || "0.0.0.0", // par défaut: localhost
  },
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'heg_dab_nuxt',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css' },
    { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/gh/kognise/water.css@latest/dist/light.min.css' },
    ]
  },
/*
  ** Customize the generated output folder
  */
  generate: {
    dir: 'public'
  },


  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: [
    "node_modules/noty/lib/noty.css",
    "node_modules/noty/lib/themes/relax.css"
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/model.js',
    '~/plugins/modal.js'
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa'
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {

  }
}
