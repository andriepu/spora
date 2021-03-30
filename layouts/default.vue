<template lang="pug">
  .o-app
    .o-sidebar
      p-menu(:model="items")

    .o-content: nuxt

    p-toast(position="bottom-right")
</template>

<script>
import PMenu from 'primevue/menu';
import PToast from 'primevue/toast';

export default {
  middleware: 'auth',

  components: {
    PMenu,
    PToast,
  },

  computed: {
    items () {
      return [
        {
          label: 'Grooming',
          items: [
            this.createMenuItem({
              label: 'Add to Confluence',
              icon: 'pi pi-file',
              to: '/groomings/confluence/new',
            }),
            this.createMenuItem({
              label: 'Sync to JIRA',
              icon: 'pi pi-arrow-circle-up',
              to: '/groomings/jira/sync',
            }),
          ],
        },
        {
          separator: true,
        },
        {
          label: 'Retrospective',
          items: [
            this.createMenuItem({
              label: 'Export MetroRetro',
              icon: 'pi pi-file',
              to: '/retros/confluence/new',
            }),
          ],
        },
      ];
    },
  },

  methods: {
    createMenuItem ({ label, icon, to }) {
      return {
        label,
        icon,
        to,
        style: this.$route.path === to && 'background-color: #e9ecef',
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.o-app {
  position: relative;
  max-width: 1200px;
  min-width: 780px;
  margin: 0 auto;
  padding: 0 24px;
}

.o-sidebar {
  position: fixed;
  top: 5rem;
  // left: 2rem;
  height: 100vh;

  /deep/ .p-menu {
    padding: 0;
  }
}

.o-content {
  margin-left: 210px;
  padding: 2rem;
}
</style>
