import axios from 'axios'
import fs from 'fs'
import path from 'path'
import { Index } from 'flexsearch'

const dynamicRoutes = async () => {
  axios.defaults.baseURL = process.env.API_SERVER_URL
  const numDonghuas = await axios.get('/donghuas/count').then((res) => res.data)
  let donghuas = await axios.get('/donghuas').then((res) => res.data)
  while (donghuas.length < numDonghuas) {
    donghuas = donghuas.concat(
      await axios
        .get('/donghuas?_start=' + donghuas.length)
        .then((res) => res.data)
    )
  }

  const donghuaRoutes = donghuas.map((donghua) => {
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
    title: 'DonghuaHub',
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

  hooks: {
    build: {
      async before(builder) {
        axios.defaults.baseURL = process.env.API_SERVER_URL
        const numDonghuas = await axios
          .get('/donghuas/count')
          .then((res) => res.data)
        let donghuas = await axios.get('/donghuas').then((res) => res.data)
        while (donghuas.length < numDonghuas) {
          donghuas = donghuas.concat(
            await axios
              .get('/donghuas?_start=' + donghuas.length)
              .then((res) => res.data)
          )
        }
        const indexEn = new Index()
        const indexRom = new Index()
        const titleMap = {}
        for (const donghua of donghuas) {
          donghua.id = parseInt(donghua.id)
          titleMap[donghua.id] = ['', '']
          if (donghua.titles.en) {
            indexEn.add(donghua.id, donghua.titles.en)
            titleMap[donghua.id][0] = donghua.titles.en
          }
          if (donghua.titles.romanized) {
            indexRom.add(donghua.id, donghua.titles.romanized)
            titleMap[donghua.id][1] = donghua.titles.romanized
          }
        }
        const staticDir = path.join(builder.nuxt.options.rootDir, 'static')
        fs.writeFileSync(
          staticDir + '/titleIndex.json',
          JSON.stringify(titleMap)
        )

        // await indexEn.export((key, data) => {
        //   return new Promise((resolve) => {
        //     fs.writeFileSync(staticDir + '/searchIndexEn_key', key)
        //     fs.writeFileSync(staticDir + '/searchIndexEn_data', data)
        //     resolve()
        //   })
        // })
        // await indexRom.export((key, data) => {
        //   return new Promise((resolve) => {
        //     fs.writeFileSync(staticDir + '/searchIndexRom_key', key)
        //     fs.writeFileSync(staticDir + '/searchIndexRom_data', data)
        //     resolve()
        //   })
        // })
      },
    },
  },
}
