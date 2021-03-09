export default {
  server: {
    port: process.env.PORT || 3000,
  },
  ssr: false,
  mode: 'universal',
  target: 'server',
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
    ],
  },
  css: [
    '~/assets/css/styles.scss',
  ],
  plugins: [
    { src: '~plugins/primevue.js', ssr: false },
    { src: '~plugins/vue-codemirror.js', ssr: false },
    { src: '~plugins/vue-loading-overlay.js', ssr: false },
  ],
  components: true,
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/stylelint-module',
  ],
  modules: [
    '@nuxtjs/dotenv',
    'nuxt-basic-auth-module',
    'cookie-universal-nuxt',
  ],
  basic: {
    name: process.env.BASIC_USER,
    pass: process.env.BASIC_PASS,
    enabled: true,
  },

  build: {},

  serverMiddleware: [
    '~/api',
    // {
    //   path: '/api/post-grooming-document',
    //   handler: '~/api/post-grooming-document',
    // },
    // {
    //   path: '/api/post-grooming-for-jira',
    //   handler: '~/api/post-grooming-for-jira',
    // },
    // {
    //   path: '/api/get-sprints',
    //   handler: '~/api/get-sprints',
    // },
    // {
    //   path: '/api/get-sprint-issues',
    //   handler: '~/api/get-sprint-issues',
    // },
    // {
    //   path: '/api/get-recent-groomings',
    //   handler: '~/api/get-recent-groomings',
    // },
  ],

  env: {
    JIRA_URL: process.env.JIRA_URL,
  },
};
