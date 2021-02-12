export default {
  server: {
    port: process.env.PORT || 3000,
  },
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  mode: 'universal',
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'server',
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: 'Scrum Assistant',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'https://s1.bukalapak.com/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,500;0,700;1,300;1,500;1,700&display=swap',
      },
      {
        rel: 'stylesheet',
        href: 'https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css',
      },
    ],
  },
  /*
  ** Global CSS
  */
  css: [
    'vuesax/dist/vuesax.css',
    'codemirror/lib/codemirror.css',
    'codemirror/addon/merge/merge.css',
    'codemirror/theme/idea.css',
    '~/assets/css/styles.scss',
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    '~/plugins/vuesax',
    { src: '~plugins/vue-codemirror.js', ssr: false },
  ],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    'nuxt-basic-auth-module',
    'cookie-universal-nuxt',
  ],
  basic: {
    name: process.env.BASIC_USER,
    pass: process.env.BASIC_PASS,
    enabled: true,
  },
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
  },

  serverMiddleware: [
    '~/api/_cookie-parser',
    '~/api/_body-parser',
    '~/api/_body-parser-json',
    '~/api/_query-parser',
    '~/api/_response',
    {
      path: '/api',
      handler: '~/api/_api-guard',
    },
    {
      path: '/api/post-retro-for-confluence',
      handler: '~/api/post-retro-for-confluence',
    },
    {
      path: '/api/post-grooming-for-confluence',
      handler: '~/api/post-grooming-for-confluence',
    },
    {
      path: '/api/post-grooming-for-jira',
      handler: '~/api/post-grooming-for-jira',
    },
    {
      path: '/api/get-sprints',
      handler: '~/api/get-sprints',
    },
    {
      path: '/api/get-sprint-issues',
      handler: '~/api/get-sprint-issues',
    },
    {
      path: '/api/get-recent-groomings',
      handler: '~/api/get-recent-groomings',
    },
  ],
};
