<template lang="pug">
  div(style="margin-bottom:36px")
    vs-sidebar(v-model="activeTab" reduce open right)
      template(#logo)
        img(src="https://s1.bukalapak.com/ast/sigil/preproduction/bukalapak-logo-icon.svg")

      vs-sidebar-item(id="retros-metroretro-to-confluence" to="/retros/metroretro-to-confluence")
        template(#icon)
          img(src="/images/metroretro-icon.png" style="width:28px;height:28px")
        | Import Metro Retro

      vs-sidebar-item(id="groomings-jira-to-confluence" to="/groomings/jira-to-confluence")
        template(#icon)
          img(src="/images/jira-icon.png" style="width:24px;height:24px")
        | JIRA to Confluence

      vs-sidebar-item(id="groomings-confluence-to-jira" to="/groomings/confluence-to-jira")
        template(#icon)
          img(src="/images/confluence-icon.png" style="width:20px;height:20px")
        | Confluence to JIRA

    .content: nuxt
</template>

<script>
const LOADING_TYPES = [
  'default',
  'waves',
  'corners',
  'border',
  'points',
  'square',
  'gradient',
  'rectangle',
  'circles',
  'square-rotate',
  'scale',
];

export default {
  middleware: 'auth',

  data: () => ({
    activeTab: '',
  }),

  watch: {
    $route: {
      immediate: true,
      handler ({ name = '' } = {}) {
        this.activeTab = name.split('/').pop();
      },
    },
  },

  created () {
    this.$vs.load = options => (
      this.$vs.loading({
        type: LOADING_TYPES[Date.now() % LOADING_TYPES.length],
        ...options,
      })
    );
  },
};
</script>
