import axios from 'axios'

const dynamicRoutes = async () => {
  axios.defaults.baseURL = process.env.API_SERVER_URL
  const donghuas = await axios.get('/donghuas')
  const donghuaRoutes = donghuas.data.map((donghua) => {
    return {
      route: `/donghuas/${donghua.id}`,
      payload: donghua,
    }
  })

  const routes = donghuaRoutes
  return routes
}

export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Donghua Hub',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['ant-design-vue/dist/antd.css'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: ['@/plugins/antd-ui', '@/plugins/disqus'],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  publicRuntimeConfig: {
    axios: {
      browserBaseURL: process.env.API_SERVER_URL,
      baseURL: process.env.API_SERVER_URL,
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},

  generate: {
    routes: dynamicRoutes,
  },
}
