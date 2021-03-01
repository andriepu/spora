<template lang="pug">
  div
    .o-sidebar
      Menu(:model="items")
    .o-content: nuxt
</template>

<script>
export default {
  middleware: 'auth',

  computed: {
    items () {
      return [
        {
          label: 'Grooming',
          items: [
            this.createMenuItem({
              label: 'Create Document',
              icon: 'pi pi-file',
              to: '/groomings/create-document',
            }),
            this.createMenuItem({
              label: 'Sync to JIRA',
              icon: 'pi pi-arrow-circle-up',
              to: '/groomings/sync-jira',
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
              label: 'Import MetroRetro',
              icon: 'pi pi-file',
              to: '/retros/import-metroretro',
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
.o-sidebar {
  position: fixed;
  top: 2rem;
  left: 2rem;
  height: 100vh;
}

.o-content {
  margin-left: 210px;
  padding: 2rem;
}
</style>
