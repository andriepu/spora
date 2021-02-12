<template lang="pug">
  div(style="margin-bottom:36px")
    vs-sidebar(
      v-model="activeTab"
      hoverExpand
      open
      reduce
      )

      template(#logo)
        img(src="https://s1.bukalapak.com/ast/sigil/preproduction/bukalapak-logo-icon.svg" style="height:80px")

      vs-sidebar-item(style="margin-top:12px" id="retros-metroretro-to-confluence" to="/retros/metroretro-to-confluence")
        template(#icon)
          img(src="/images/metroretro-icon.png" style="width:28px;height:28px")
        | Import Metro Retro

      vs-sidebar-item(style="margin-top:12px" id="groomings-jira-to-confluence" to="/groomings/jira-to-confluence")
        template(#icon)
          img(src="/images/confluence-icon.png" style="width:20px;height:20px")
        | Create Grooming Document

      vs-sidebar-item(id="groomings-confluence-to-jira" to="/groomings/confluence-to-jira")
        template(#icon)
          img(src="/images/jira-icon.png" style="width:24px;height:24px")
        | Sync Grooming Document

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
    isSidebarHover: false,
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

<style lang="scss" scoped>
.content {
  margin: 36px 16px;
  transition: 0.2s ease-out;
}

.vs-sidebar-content {
  transition: 0.2s ease-out;

  + .content {
    margin-left: 240px;
  }

  &.reduce + .content {
    margin-left: 16px;
  }
}
</style>
